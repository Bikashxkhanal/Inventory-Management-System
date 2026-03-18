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

 public function countStockStatuses(): array {

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

//get stock quantity  
public function getStockQuantityByProduct(string $productId) {
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
public function getStockSellingPriceByProduct(string $productId) {
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
