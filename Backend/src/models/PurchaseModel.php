<?php
namespace App\Models;

use App\Helpers\PurchaseSchema;
use PDO;

class PurchaseModel
{
    public function create(int $vendorId, string $purchaseDate, ?int $createdBy = null): array
    {
        global $pdo;

        $columns = ['vendor_id'];
        $placeholders = ['?'];
        $values = [$vendorId];

        if (PurchaseSchema::hasPurchaseColumn('purchase_date')) {
            $columns[] = 'purchase_date';
            $placeholders[] = '?';
            $values[] = $purchaseDate;
        }

        if (PurchaseSchema::hasPurchaseColumn('status')) {
            $columns[] = 'status';
            $placeholders[] = '?';
            $values[] = 'draft';
        }

        if (PurchaseSchema::hasPurchaseColumn('created_by') && $createdBy !== null) {
            $columns[] = 'created_by';
            $placeholders[] = '?';
            $values[] = $createdBy;
        }

        if (PurchaseSchema::hasPurchaseColumn('total_amount')) {
            $columns[] = 'total_amount';
            $placeholders[] = '?';
            $values[] = 0;
        }

        $sql = sprintf(
            'INSERT INTO purchase (%s) VALUES (%s)',
            implode(', ', $columns),
            implode(', ', $placeholders)
        );
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        return ['success' => true, 'id' => (int) $pdo->lastInsertId()];
    }

    public function fetchPaginated(int $page, int $limit, ?string $statusFilter = null): array
    {
        global $pdo;
        $offset = ($page - 1) * $limit;

        $where = '';
        $params = [];
        if (
            $statusFilter !== null &&
            $statusFilter !== '' &&
            $statusFilter !== 'all' &&
            PurchaseSchema::hasPurchaseColumn('status')
        ) {
            if (
                $statusFilter === 'rejected' &&
                !PurchaseSchema::supportsRejectedStatus()
            ) {
                return [
                    'data' => [],
                    'meta' => [
                        'current_page' => $page,
                        'total_pages' => 0,
                        'total_records' => 0,
                    ],
                ];
            }
            if (PurchaseSchema::canSetStatus($statusFilter)) {
                $where = ' WHERE p.status = ?';
                $params[] = $statusFilter;
            }
        }

        $countSql = 'SELECT COUNT(*) FROM purchase p' . $where;
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $totalRecords = (int) $countStmt->fetchColumn();
        $totalPages = $limit > 0 ? (int) ceil($totalRecords / $limit) : 1;

        $select = [
            'p.id AS id',
            'v.name AS vendor',
        ];

        if (PurchaseSchema::hasPurchaseColumn('purchase_date')) {
            $select[] = 'p.purchase_date AS purchase_date';
        } else {
            $select[] = 'DATE(p.created_at) AS purchase_date';
        }

        if (PurchaseSchema::hasPurchaseColumn('total_amount')) {
            $select[] = 'p.total_amount AS total_amount';
        } else {
            $select[] = '0 AS total_amount';
        }

        if (PurchaseSchema::hasPurchaseColumn('status')) {
            $select[] = 'p.status AS status';
        } else {
            $select[] = "'draft' AS status";
        }

        $select[] = 'p.created_at AS created_at';

        $sql = sprintf(
            'SELECT %s FROM purchase p INNER JOIN vendor v ON v.id = p.vendor_id%s ORDER BY p.created_at DESC LIMIT ? OFFSET ?',
            implode(', ', $select),
            $where
        );

        $stmt = $pdo->prepare($sql);
        $i = 1;
        foreach ($params as $param) {
            $stmt->bindValue($i++, $param);
        }
        $stmt->bindValue($i++, $limit, PDO::PARAM_INT);
        $stmt->bindValue($i, $offset, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC),
            'meta' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_records' => $totalRecords,
            ],
        ];
    }

    public function findById(int $id): ?array
    {
        global $pdo;

        $select = [
            'p.id',
            'p.vendor_id',
            'v.name AS vendor',
        ];

        if (PurchaseSchema::hasPurchaseColumn('purchase_date')) {
            $select[] = 'p.purchase_date';
        } else {
            $select[] = 'DATE(p.created_at) AS purchase_date';
        }

        if (PurchaseSchema::hasPurchaseColumn('total_amount')) {
            $select[] = 'p.total_amount';
        } else {
            $select[] = '0 AS total_amount';
        }

        if (PurchaseSchema::hasPurchaseColumn('status')) {
            $select[] = 'p.status';
        } else {
            $select[] = "'draft' AS status";
        }

        $select[] = 'p.created_at';

        $sql = sprintf(
            'SELECT %s FROM purchase p INNER JOIN vendor v ON v.id = p.vendor_id WHERE p.id = ? LIMIT 1',
            implode(', ', $select)
        );

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function fetchStats(): array
    {
        global $pdo;

        if (PurchaseSchema::hasPurchaseColumn('status')) {
            $rejectedExpr = PurchaseSchema::supportsRejectedStatus()
                ? "SUM(status = 'rejected')"
                : '0';
            $stmt = $pdo->query("
                SELECT
                    COUNT(*) AS total,
                    SUM(status = 'draft') AS draft,
                    SUM(status = 'completed') AS completed,
                    {$rejectedExpr} AS rejected
                FROM purchase
            ");
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        $stmt = $pdo->query('SELECT COUNT(*) AS total FROM purchase');
        $total = (int) $stmt->fetchColumn();
        return [
            'total' => $total,
            'draft' => $total,
            'completed' => 0,
        ];
    }

    public function updateTotal(int $purchaseId, float $amount): void
    {
        if (!PurchaseSchema::hasPurchaseColumn('total_amount')) {
            return;
        }
        global $pdo;
        $stmt = $pdo->prepare('UPDATE purchase SET total_amount = total_amount + ? WHERE id = ?');
        $stmt->execute([$amount, $purchaseId]);
    }

    public function setStatus(int $purchaseId, string $status): void
    {
        if (!PurchaseSchema::hasPurchaseColumn('status')) {
            return;
        }
        if (!PurchaseSchema::canSetStatus($status)) {
            throw new \InvalidArgumentException(
                "Status '{$status}' is not allowed. Run Backend/migrations/002_add_rejected_status.sql to enable reject."
            );
        }
        global $pdo;
        $stmt = $pdo->prepare('UPDATE purchase SET status = ? WHERE id = ?');
        $stmt->execute([$status, $purchaseId]);
    }

    public function getStatus(int $purchaseId): string
    {
        if (!PurchaseSchema::hasPurchaseColumn('status')) {
            return 'draft';
        }
        global $pdo;
        $stmt = $pdo->prepare('SELECT status FROM purchase WHERE id = ?');
        $stmt->execute([$purchaseId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['status'] ?? 'draft';
    }

    public function updateHeader(int $id, int $vendorId, string $purchaseDate): void
    {
        global $pdo;

        if (PurchaseSchema::hasPurchaseColumn('purchase_date')) {
            $stmt = $pdo->prepare('UPDATE purchase SET vendor_id = ?, purchase_date = ? WHERE id = ?');
            $stmt->execute([$vendorId, $purchaseDate, $id]);
            return;
        }

        $stmt = $pdo->prepare('UPDATE purchase SET vendor_id = ? WHERE id = ?');
        $stmt->execute([$vendorId, $id]);
    }

    public function deleteById(int $id): void
    {
        global $pdo;
        $stmt = $pdo->prepare('DELETE FROM purchase WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function getTotalPurchaseAmountByDateRange(string $startDate, string $endDate)
    {
        global $pdo;

        if (PurchaseSchema::hasPurchaseColumn('total_amount') && PurchaseSchema::hasPurchaseColumn('status')) {
            $stmt = $pdo->prepare("
                SELECT SUM(total_amount) AS totalAmount
                FROM purchase
                WHERE status = 'completed'
                AND created_at BETWEEN ? AND ?
            ");
        } elseif (PurchaseSchema::hasPurchaseColumn('total_amount')) {
            $stmt = $pdo->prepare('
                SELECT SUM(total_amount) AS totalAmount
                FROM purchase
                WHERE created_at BETWEEN ? AND ?
            ');
        } else {
            return 0;
        }

        $stmt->execute([$startDate, $endDate]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['totalAmount'] ?? 0;
    }

    public function getPurchaseAmountOfDateRange(string $startDate, string $endDate)
    {
        global $pdo;

        if (PurchaseSchema::hasPurchaseColumn('total_amount') && PurchaseSchema::hasPurchaseColumn('status')) {
            $stmt = $pdo->prepare("
                SELECT DATE(created_at) AS purchaseCreatedDate, SUM(total_amount) AS amount
                FROM purchase
                WHERE status = 'completed'
                AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)
                GROUP BY DATE(created_at)
            ");
        } elseif (PurchaseSchema::hasPurchaseColumn('total_amount')) {
            $stmt = $pdo->prepare('
                SELECT DATE(created_at) AS purchaseCreatedDate, SUM(total_amount) AS amount
                FROM purchase
                WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
                GROUP BY DATE(created_at)
            ');
        } else {
            return [];
        }

        $stmt->execute([$startDate, $endDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function fetchPurchasesDetailsList(int $page, int $limit, array $filters = []): array
    {
        global $pdo;
        $offset = ($page - 1) * $limit;
        $where = ['1=1'];
        $params = [];

        if (!empty($filters['vendor_id'])) {
            $where[] = 'p.vendor_id = ?';
            $params[] = (int) $filters['vendor_id'];
        }
        if (!empty($filters['date_from'])) {
            $where[] = 'DATE(p.created_at) >= ?';
            $params[] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[] = 'DATE(p.created_at) <= ?';
            $params[] = $filters['date_to'];
        }
        if (!empty($filters['status'])) {
            if (PurchaseSchema::hasPurchaseColumn('status')) {
                $where[] = 'p.status = ?';
                $params[] = $filters['status'];
            }
        }
        if (!empty($filters['category_id'])) {
            $itemTable = PurchaseSchema::purchaseItemsTable();
            $where[] = "EXISTS (
                SELECT 1 FROM `{$itemTable}` pi
                INNER JOIN product pr ON pr.id = pi.product_id
                WHERE pi.purchase_id = p.id AND pr.category_id = ?
            )";
            $params[] = (int) $filters['category_id'];
        }
        if (!empty($filters['product_id'])) {
            $itemTable = PurchaseSchema::purchaseItemsTable();
            $where[] = "EXISTS (
                SELECT 1 FROM `{$itemTable}` pi
                WHERE pi.purchase_id = p.id AND pi.product_id = ?
            )";
            $params[] = (int) $filters['product_id'];
        }

        $whereSql = implode(' AND ', $where);
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM purchase p WHERE {$whereSql}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();
        $totalPages = $limit > 0 ? (int) ceil($total / $limit) : 1;

        $dateCol = PurchaseSchema::hasPurchaseColumn('purchase_date')
            ? 'p.purchase_date'
            : 'DATE(p.created_at)';
        $amountCol = PurchaseSchema::hasPurchaseColumn('total_amount')
            ? 'p.total_amount'
            : '0';
        $statusCol = PurchaseSchema::hasPurchaseColumn('status')
            ? 'p.status'
            : "'completed'";

        $limit = max(1, (int) $limit);
        $offset = max(0, (int) $offset);
        $limitSql = \App\Helpers\EntitySchema::sqlLimitOffset($limit, $offset);
        $stmt = $pdo->prepare("
            SELECT
                p.id,
                v.name AS vendor,
                {$dateCol} AS purchaseDate,
                {$amountCol} AS totalAmount,
                {$statusCol} AS status,
                p.created_at AS createdAt
            FROM purchase p
            INNER JOIN vendor v ON v.id = p.vendor_id
            WHERE {$whereSql}
            ORDER BY p.id DESC
            {$limitSql}
        ");
        $stmt->execute($params);
        $purchases = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($purchases)) {
            return [
                'data' => [],
                'meta' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_records' => $total,
                ],
            ];
        }

        $ids = array_column($purchases, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $itemTable = PurchaseSchema::purchaseItemsTable();
        $priceCol = PurchaseSchema::itemPriceColumn();
        $subtotalCol = PurchaseSchema::itemSubtotalColumn();
        $subSelect = $subtotalCol !== null
            ? "pi.`{$subtotalCol}` AS lineTotal"
            : "(pi.quantity * pi.`{$priceCol}`) AS lineTotal";

        $itemsStmt = $pdo->prepare("
            SELECT
                pi.purchase_id AS purchaseId,
                pr.id AS productId,
                pr.name AS productName,
                COALESCE(cat.name, '—') AS category,
                pi.quantity,
                pi.`{$priceCol}` AS unitPrice,
                {$subSelect}
            FROM `{$itemTable}` pi
            INNER JOIN product pr ON pr.id = pi.product_id
            LEFT JOIN category cat ON cat.id = pr.category_id
            WHERE pi.purchase_id IN ({$placeholders})
        ");
        $itemsStmt->execute($ids);
        $itemRows = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

        $byPurchase = [];
        foreach ($itemRows as $row) {
            $byPurchase[$row['purchaseId']][] = $row;
        }
        foreach ($purchases as &$purchase) {
            $purchase['items'] = $byPurchase[$purchase['id']] ?? [];
        }
        unset($purchase);

        return [
            'data' => $purchases,
            'meta' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_records' => $total,
            ],
        ];
    }
}
