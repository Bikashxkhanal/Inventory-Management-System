<?php

namespace App\Models;

use PDO;

class SalesModel {
  

    public function __construct() {
        
    }

    // Fetch paginated sales
    public function fetchPaginated(int $page, int $limit): array {
        global $pdo;
        $offset = ($page - 1) * $limit;

        $stmt = $pdo->prepare("
            SELECT id, customer_name, total_amount, status, created_at 
            FROM sales 
            ORDER BY id DESC 
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count for pagination
        $countStmt = $pdo->query("SELECT COUNT(*) as total FROM sales");
        $totalRecords = (int)$countStmt->fetch(PDO::FETCH_ASSOC)['total'];
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

    // Insert a sale
    public function insertSale(array $data): array {
        global $pdo;
        $stmt = $pdo->prepare("
            INSERT INTO sales (customer_name, total_amount, status, created_by)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['customer_name'],
            $data['total_amount'],
            $data['status'],
            $data['created_by']
        ]);

        return ['success' => true, 'id' => $pdo->lastInsertId()];
    }

    // Update a sale
    public function updateSaleDetails(array $data): array {
        global $pdo;
        $stmt = $pdo->prepare("
            UPDATE sales 
            SET customer_name = ?, total_amount = ?, status = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['customer_name'],
            $data['total_amount'],
            $data['status'],
            $data['id']
        ]);

        return ['success' => true];
    }

    //get total sells amout of this month/week or date range  
    public function getSellsAmountByDate(string $startDate, string $endDate) {
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT SUM(total_amount) AS TotalSalesAmount 
        FROM sales 
        WHERE status = 'completed' 
        AND created_at BETWEEN ? AND ?
    ");

    $stmt->execute([$startDate, $endDate]);

    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result['TotalSalesAmount'] ?? 0;
}
    //get total sales count for the date raange 
    public function getSalesCountByDate(string $startDate, string $endDate){
        global $pdo;
        $stmt = $pdo->prepare("
        SELECT COUNT(*) as TotalSalesCount 
        FROM sales
        WHERE status='completed' AND created_at
        BETWEEN ? AND ? ");


        $stmt->execute([$startDate, $endDate]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['TotalSalesCount'] ?? 0;

        }
}
