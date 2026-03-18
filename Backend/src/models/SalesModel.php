<?php

namespace App\Models;

use PDO;
use Exception;
use Throwable;

class SalesModel {
    public function __construct() {}

    //fetch paginated sales
    public function fetchPaginated(int $page, int $limit): array {
        global $pdo;
        $offset = ($page - 1) * $limit;

        $stmt = $pdo->prepare("
            SELECT *
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
        try{    
        global $pdo;

       //insert into sales 
        $stmt = $pdo->prepare("
            INSERT INTO sales (customer_id, status, created_by)
            VALUES (?, ?, ?)
        ");
        $status = $stmt->execute([
            $data['customerId'],
            $data['status'], 
            $data['createdBy'],
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
