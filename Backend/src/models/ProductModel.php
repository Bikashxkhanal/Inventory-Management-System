<?php 
namespace App\Models;


use App\Helpers\EntitySchema;
use App\Models\CategoryModel;
use DomainException;
use Exception;
use RuntimeException;
use PDO;

class ProductModel {


    public function fetchAll() {
         global $pdo;
        $stmt = $pdo->query("SELECT id, name FROM product");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function fetchByCategory(int $categoryId): array
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT id, name FROM product WHERE category_id = :category_id");
    $stmt->execute(['category_id' => $categoryId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public function updateStock($productId, $quantity) {
         global $pdo;
        $stmt = $pdo->prepare("UPDATE product SET stock = stock + ? WHERE id = ?");
        $stmt->execute([$quantity, $productId]);
    }


    public function getProductName(int $productId){
        global $pdo;
        
        $stmt = $pdo->prepare("SELECT name FROM product WHERE id = ?");
        $stmt->execute([$productId]);

       $result =  $stmt->fetch(PDO::FETCH_ASSOC);
       if(!$result){
            throw new Exception("Product id doesnot exist");
       }
       
       return $result ;
    }


    public function getSearchedProduct(string $searchQuery, int $companyId){
        global $pdo; 

         $stmt =  $pdo->prepare("
                SELECT 
                id AS id,
                name AS name
                FROM product WHERE company_id = ? AND name LIKE CONCAT('%', ? , '%')
        ");

        $stmt->execute([$companyId, $searchQuery]);

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function findProductIdByName(string $productName) {
        global $pdo;
        $stmt = $pdo->prepare("
                SELECT id FROM product 
                WHERE LOWER(name) = LOWER(?)
        ");

        $stmt->execute([$productName]);

       $result =  $stmt->fetch(PDO::FETCH_ASSOC);
       return $result['id'] ;

    }

    public function fetchCatalog(int $page, int $limit, int $companyId, ?string $search = null, ?string $viewerRole = null): array
    {
        global $pdo;
        $offset = ($page - 1) * $limit;
        $where = ['p.company_id = ?'];
        $params = [$companyId];

        if (EntitySchema::hasColumn('product', 'approval_status')) {
            if (strtolower((string) $viewerRole) !== 'superadmin') {
                $where[] = "(p.approval_status IS NULL OR p.approval_status = 'active')";
            } else {
                $where[] = "(p.approval_status IS NULL OR p.approval_status != 'inactive')";
            }
        }

        if ($search) {
            $where[] = '(p.name LIKE ? OR CAST(p.id AS CHAR) LIKE ?)';
            $q = '%' . $search . '%';
            $params[] = $q;
            $params[] = $q;
        }

        $whereSql = implode(' AND ', $where);
        $approvalCol = EntitySchema::hasColumn('product', 'approval_status')
            ? 'p.approval_status AS approvalStatus'
            : "'active' AS approvalStatus";

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM product p WHERE {$whereSql}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $sql = "
            SELECT
                p.id AS productId,
                p.name AS name,
                COALESCE(c.name, '—') AS category,
                COALESCE(st.selling_price, 0) AS sellingPrice,
                {$approvalCol},
                CASE
                    WHEN COALESCE(sales.qty, 0) >= 50 THEN 'high'
                    WHEN COALESCE(sales.qty, 0) >= 15 THEN 'moderate'
                    ELSE 'low'
                END AS sellingTrend
            FROM product p
            LEFT JOIN category c ON c.id = p.category_id
            LEFT JOIN stock st ON st.product_id = p.id
            LEFT JOIN (
                SELECT product_id, SUM(quantity) AS qty
                FROM sales_items
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY product_id
            ) sales ON sales.product_id = p.id
            WHERE {$whereSql}
            ORDER BY p.id DESC
        ";
        $limit = max(1, (int) $limit);
        $offset = max(0, (int) $offset);
        $sql .= EntitySchema::sqlLimitOffset($limit, $offset);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return [
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC),
            'meta' => [
                'current_page' => $page,
                'total_pages' => $limit > 0 ? (int) ceil($total / $limit) : 1,
                'total_records' => $total,
            ],
        ];
    }

    public function createProduct(array $data, int $companyId, int $createdBy, string $creatorRole): int
    {
        global $pdo;
        $approval = strtolower($creatorRole) === 'superadmin' ? 'active' : 'pending';
        $pdo->beginTransaction();
        try {
            if (EntitySchema::hasColumn('product', 'category_id')) {
                if (empty($data['category_id'])) {
                    throw new Exception('Category is required');
                }
                $categoryModel = new CategoryModel();
                if (!$categoryModel->exists((int) $data['category_id'])) {
                    throw new Exception('Invalid category');
                }
            }

            $cols = ['name'];
            $vals = [$data['name']];
            if (EntitySchema::hasColumn('product', 'category_id')) {
                $cols[] = 'category_id';
                $vals[] = (int) $data['category_id'];
            }
            if (EntitySchema::hasColumn('product', 'approval_status')) {
                $cols[] = 'approval_status';
                $vals[] = $approval;
            }
            if (EntitySchema::hasColumn('product', 'created_by')) {
                $cols[] = 'created_by';
                $vals[] = $createdBy;
            }

            if (EntitySchema::hasColumn('product', 'sell_price')) {
                $cols[] = 'sell_price';
                $vals[] = $data['selling_price'];
            }

            if (EntitySchema::hasColumn('product', 'company_id')) {
                $cols[] = 'company_id';
                $vals[] = $companyId;
            }

            if (EntitySchema::hasColumn('product', 'buy_price')) {
                $cols[] = 'buy_price';
                $vals[] = 0;
            }

            $ph = implode(', ', array_fill(0, count($cols), '?'));
            $stmt = $pdo->prepare('INSERT INTO product (' . implode(', ', $cols) . ") VALUES ({$ph})");
            $stmt->execute($vals);
            $productId = (int) $pdo->lastInsertId();

            $price = (float) ($data['selling_price'] ?? 0);
            $exists = $pdo->prepare('SELECT 1 FROM stock WHERE product_id = ? LIMIT 1');
            $exists->execute([$productId]);
            if ($exists->fetchColumn()) {
                $upd = $pdo->prepare('UPDATE stock SET selling_price = ? WHERE product_id = ?');
                $upd->execute([$price, $productId]);
            } else {
                $stockStmt = $pdo->prepare(
                    'INSERT INTO stock (product_id, quantity, selling_price) VALUES (?, 0, ?)'
                );
                $stockStmt->execute([$productId, $price]);
            }

            $pdo->commit();
            return $productId;
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function updateProductRow(int $id, array $data): bool
    {
        global $pdo;
        $sets = [];
        $vals = [];
        if (isset($data['name'])) {
            $sets[] = 'name = ?';
            $vals[] = $data['name'];
        }
        if (EntitySchema::hasColumn('product', 'category_id') && isset($data['category_id'])) {
            $sets[] = 'category_id = ?';
            $vals[] = (int) $data['category_id'];
        }
        if (!$sets) {
            return false;
        }
        $vals[] = $id;
        $stmt = $pdo->prepare('UPDATE product SET ' . implode(', ', $sets) . ' WHERE id = ?');
        $stmt->execute($vals);
        return $stmt->rowCount() > 0;
    }

    public function softDeleteProduct(int $id): bool
    {
        global $pdo;
        EntitySchema::ensureApprovalStatusColumn('product');
        $stmt = $pdo->prepare("UPDATE product SET approval_status = 'inactive' WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public function setProductApproval(int $id, bool $approve): bool
    {
        global $pdo;
        if (!EntitySchema::hasColumn('product', 'approval_status')) {
            return true;
        }
        $status = $approve ? 'active' : 'inactive';
        $stmt = $pdo->prepare('UPDATE product SET approval_status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        return $stmt->rowCount() > 0;
    }

    public function updateSellingPrice(int $productId, float $price): bool
    {
        global $pdo;
        $stmt = $pdo->prepare('UPDATE stock SET selling_price = ? WHERE product_id = ?');
        $stmt->execute([$price, $productId]);
        if ($stmt->rowCount() > 0) {
            return true;
        }
        $insert = $pdo->prepare(
            'INSERT INTO stock (product_id, quantity, selling_price) VALUES (?, 0, ?)'
        );
        $insert->execute([$productId, $price]);
        return true;
    }
}
