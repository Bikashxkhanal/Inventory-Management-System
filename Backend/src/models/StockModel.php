<?php 
namespace App\Models;

use PDO;
use Exception;
use Throwable;

class StockModel {

    public function __construct() {
    
    }

public function fetchStocks(int $offset, int $limit): array {
     global $pdo;
    $stmt = $pdo->prepare("
    SELECT 
        p.id AS productId,
        p.name AS name,
        s.quantity AS stock,
        s.selling_price AS sellingPrice,
        CASE 
            WHEN s.quantity < 200 THEN 'Low Stock'
            WHEN s.quantity > 1000 THEN 'High Stock'
            ELSE 'In Stock'
        END AS status
    FROM product AS p INNER JOIN stock AS s ON p.id = s.product_id
    ORDER BY p.id DESC
    LIMIT :limit OFFSET :offset
    ");

   

    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public function countStocks(): int {
            global $pdo;
        $stmt = $pdo->query("SELECT COUNT(*) FROM stock");
        return (int)$stmt->fetchColumn();
    }

 public function countStockStatuses(): array {

        global $pdo;
   $stmt = $pdo->query("
    SELECT
        COUNT(*) AS total,

        SUM(CASE WHEN quantity < 200 THEN 1 ELSE 0 END) AS outOfStock,

        SUM(CASE 
            WHEN quantity >= 200 AND quantity <= 1000 THEN 1 
            ELSE 0 
        END) AS inStock,

        SUM(CASE 
            WHEN quantity > 1000 THEN 1 
            ELSE 0 
        END) AS highStock

    FROM stock
");

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

//get stock quantity  
public function getStockQuantityByProduct(int $productId) {
    global $pdo;
    $stmt =  $pdo->prepare("
        SELECT quantity
         FROM stock 
         WHERE product_id = ?
    ");

    $stmt->execute([$productId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result['quantity'] ?? 0;

}

//get selling price of stock by product 
public function getStockSellingPriceByProduct(int $productId) {
    global $pdo;
    $stmt =  $pdo->prepare("
        SELECT selling_price AS sellingPrice
         FROM stock 
         WHERE product_id = ?
    ");

    $stmt->execute([$productId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result ?? 0;
}

public function reduceStock(array $stocksDatas){
    // [['productId' => .., 'quantity' => ..], [...], [...]]

    try {
        global $pdo;
        $stmt = $pdo->prepare("
            UPDATE stock
            SET quantity = quantity - ? 
            WHERE product_id = ?
        ");

         foreach ($stocksDatas as $stockData) {
        $stmt->execute([$stockData['quantity'], $stockData['productId']]);
    }

        return ['success' => true ];

    } catch (\Throwable $th) {
      throw new Exception("Failed to reduce stock");
    }
}

//check if the product has enough stock or not
public function hasEnoughStock(string $productId, int $sellingQuantity){
    $availableQty  =  (int) $this->getStockQuantityByProduct($productId);
    return $availableQty >= $sellingQuantity ? true : false;
} 

}
