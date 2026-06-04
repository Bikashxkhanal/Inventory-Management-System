<?php

namespace App\Models;

use App\Helpers\EntitySchema;
use PDO;
use Exception;
use Throwable;

class SalesModel {
    public function __construct() {}

    //fetch paginated sales
    public function fetchPaginated(int $companyId, int $page, int $limit): array
    {
        global $pdo;
    
        $offset = ($page - 1) * $limit;
    
        $stmt = $pdo->prepare("
            SELECT 
                s.id AS id,
                s.created_at AS saleDate,
                c.phone_number AS customerPhone,
                s.status AS status,
                CONCAT(sy.firstName, ' ', sy.lastName) AS soldBy,
                COALESCE((
                    SELECT COUNT(*) FROM sales_items si WHERE si.sale_id = s.id
                ), 0) AS itemCount,
                COALESCE((
                    SELECT SUM(si.subtotal) FROM sales_items si WHERE si.sale_id = s.id
                ), 0) AS totalAmount
            FROM sales AS s
            LEFT JOIN customer AS c ON c.id = s.customer_id
            LEFT JOIN sys_user AS sy ON s.created_by = sy.id
            WHERE s.company_id = :company_id
            ORDER BY s.id DESC
            LIMIT :limit OFFSET :offset
        ");
    
        $stmt->bindValue(':company_id', $companyId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
        $stmt->execute();
    
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Total count
        $countStmt = $pdo->prepare("
            SELECT COUNT(*) as total
            FROM sales
            WHERE company_id = :company_id
        ");
    
        $countStmt->bindValue(':company_id', $companyId, PDO::PARAM_INT);
        $countStmt->execute();
    
        $totalRecords = (int) $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        $totalPages = ceil($totalRecords / $limit);
    
        return [
            'data' => $data,
            'meta' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalRecords' => $totalRecords
            ]
        ];
    }

    public function fetchSalesDetailsList(int $companyId, int $page, int $limit, array $filters = []): array
    {
        global $pdo;
        $offset = ($page - 1) * $limit;
        $where = ['s.company_id = ? '];
        $params = [$companyId];

        if (!empty($filters['phone'])) {
            $where[] = 'c.phone_number LIKE ?';
            $params[] = '%' . $filters['phone'] . '%';
        }
        if (!empty($filters['date_from'])) {
            $where[] = 'DATE(s.created_at) >= ?';
            $params[] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[] = 'DATE(s.created_at) <= ?';
            $params[] = $filters['date_to'];
        }
        if (!empty($filters['category_id'])) {
            $where[] = 'EXISTS (
                SELECT 1 FROM sales_items si
                INNER JOIN product p ON p.id = si.product_id
                WHERE si.sale_id = s.id AND p.category_id = ?
            )';
            $params[] = (int) $filters['category_id'];
        }
        if (!empty($filters['product_id'])) {
            $where[] = 'EXISTS (
                SELECT 1 FROM sales_items si
                WHERE si.sale_id = s.id AND si.product_id = ?
            )';
            $params[] = (int) $filters['product_id'];
        }

        $whereSql = implode(' AND ', $where);

        $countStmt = $pdo->prepare("
            SELECT COUNT(DISTINCT s.id) AS total
            FROM sales s
            LEFT JOIN customer c ON c.id = s.customer_id
            WHERE {$whereSql}
        ");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();
        $totalPages = $limit > 0 ? (int) ceil($total / $limit) : 1;

        $limit = max(1, (int) $limit);
        $offset = max(0, (int) $offset);
        $limitSql = EntitySchema::sqlLimitOffset($limit, $offset);
        $stmt = $pdo->prepare("
            SELECT
                s.id,
                s.status,
                s.created_at AS saleDate,
                c.phone_number AS customerPhone,
                CONCAT(u.firstName, ' ', u.lastName) AS soldBy,
                COALESCE((
                    SELECT SUM(si.subtotal) FROM sales_items si WHERE si.sale_id = s.id
                ), 0) AS totalAmount
            FROM sales s
            LEFT JOIN customer c ON c.id = s.customer_id
            LEFT JOIN sys_user u ON u.id = s.created_by
            WHERE {$whereSql}
            ORDER BY s.id DESC
            {$limitSql}
        ");
        $stmt->execute($params);
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($sales)) {
            return [
                'data' => [],
                'meta' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_records' => $total,
                ],
            ];
        }

        $ids = array_column($sales, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $itemsStmt = $pdo->prepare("
            SELECT
                si.sale_id AS saleId,
                p.id AS productId,
                p.name AS productName,
                COALESCE(cat.name, '—') AS category,
                si.quantity,
                si.price AS unitPrice,
                si.subtotal
            FROM sales_items si
            INNER JOIN product p ON p.id = si.product_id
            LEFT JOIN category cat ON cat.id = p.category_id
            WHERE si.sale_id IN ({$placeholders})
            ORDER BY si.sale_id DESC, si.product_id ASC
        ");
        $itemsStmt->execute($ids);
        $itemsRows = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

        $itemsBySale = [];
        foreach ($itemsRows as $item) {
            $itemsBySale[$item['saleId']][] = $item;
        }

        foreach ($sales as &$sale) {
            $sale['items'] = $itemsBySale[$sale['id']] ?? [];
        }
        unset($sale);

        return [
            'data' => $sales,
            'meta' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_records' => $total,
            ],
        ];
    }

    // Insert a sale
    public function insertSale(array $data, $companyId): array {
        try{    
        global $pdo;

       //insert into sales 
        $stmt = $pdo->prepare("
            INSERT INTO sales (customer_id, created_by, company_id)
            VALUES (?,  ?, ?)
        ");
        $status = $stmt->execute([
            $data['customerId'],
            $data['createdBy'],
            $companyId
        ]);
    

        return ['success' => $status , 'id' => $pdo->lastInsertId()];

        } catch (\Throwable $th) {
           throw $th;
        }
    }

    // Update a sale
    // public function updateSaleDetails(array $data): array {
    //     global $pdo;
    //     $stmt = $pdo->prepare("
    //         UPDATE sales 
    //         SET customer_name = ?, total_amount = ?, status = ?
    //         WHERE id = ?
    //     ");
    //     $stmt->execute([
    //         $data['customer_name'],
    //         $data['total_amount'],
    //         $data['status'],
    //         $data['id']
    //     ]);

    //     return ['success' => true];
    // }
 
 

    //get total sales count for the date raange 
public function getSalesCountByDate(int $companyId, string $startDate, string $endDate){
        global $pdo;
        $stmt = $pdo->prepare("
        SELECT COUNT(*) as TotalSalesCount 
        FROM sales
        WHERE status='completed'
        AND company_id = ? 
        AND DATE(created_at)
        BETWEEN ? AND ? ");



        $stmt->execute([$companyId, $startDate, $endDate]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['TotalSalesCount'] ?? 0;

        }
    

  
}
