<?php 
namespace App\Models;

use PDO;

class StockModel {

    public function __construct() {
    
    }

    public function fetchStocks(int $offset, int $limit): array {
        global $pdo;
   $stmt = $pdo->prepare("
    SELECT 
        id AS productId,
        name,
        stock,
        buy_price AS purchasePrice,
        sell_price AS sellingPrice,
        CASE 
            WHEN stock < 200 THEN 'Low Stock'
            WHEN stock > 1000 THEN 'High Stock'
            ELSE 'In Stock'
        END AS status
    FROM product
    ORDER BY id DESC
    LIMIT :limit OFFSET :offset
");


        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countStocks(): int {
            global $pdo;
        $stmt = $pdo->query("SELECT COUNT(*) FROM product");
        return (int)$stmt->fetchColumn();
    }

    public function countStockStatuses(): array
{
        global $pdo;
   $stmt = $pdo->query("
    SELECT
        COUNT(*) AS total,

        SUM(CASE WHEN stock < 200 THEN 1 ELSE 0 END) AS outOfStock,

        SUM(CASE 
            WHEN stock >= 200 AND stock <= 1000 THEN 1 
            ELSE 0 
        END) AS inStock,

        SUM(CASE 
            WHEN stock > 1000 THEN 1 
            ELSE 0 
        END) AS highStock

    FROM product
");

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

}
