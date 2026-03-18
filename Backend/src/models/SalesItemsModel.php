<?php 

namespace App\Models;

use PDO;

class SalesItemsModel{

    //add sales items to the db
    public function addSalesItems(array $salesItems){
        global $pdo;
        foreach ($salesItems as $saleItems) {
            $placeholders[] = "(?, ?, ?, ?, ?)";
            $values[] = $saleItems['saleId'];
            $values[] = $saleItems['productId'];
            $values[] = $saleItems['quantity'];
            $values[] = $saleItems['unitPrice'];
            $values[] = $saleItems['subTotal'];

        }
       $stmt =  $pdo->prepare("
            INSERT INTO sales_items (sale_id, product_id, quantity, price, subtotal) VALUES" 
            . implode(',', $placeholders)
            );

        $stmt->execute($values);
        return ['success' => true];
    }

    //get total sales amout between date range
    public function getTotalSalesAmountByDateRange(string $startDate, string $endDate){
        global $pdo;

       $stmt =  $pdo->prepare("
            SELECT SUM(subtotal) AS totalAmount
            FROM sales_items 
            WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?) 
        ");

        $stmt->execute([$startDate, $endDate]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['totalAmount'] ?? 0;

    }


    public function getSalesAmountOfDateRange(string $startDate, string $endDate){
        global $pdo;

        $stmt = $pdo->prepare("
        WITH RECURSIVE date_series AS (
        SELECT ? AS salesDate
        UNION ALL
        SELECT DATE_ADD(salesDate, INTERVAL 1 DAY)
        FROM date_series
        WHERE salesDate < ?
        )
        SELECT
            ds.salesDate,
            COALESCE(SUM(si.subtotal), 0) AS totalAmount
        FROM
            date_series ds
        LEFT JOIN
            sales_items si ON DATE(si.created_at) = ds.salesDate
        GROUP BY
            ds.salesDate
        ORDER BY
            ds.salesDate
        ");

        $stmt->execute([$startDate, $endDate]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result ;

    }

}


