<?php 
namespace App\Models;

use PDO;
use Exception;
use Throwable;

class StockModel {

    public function __construct() {
    
    }

public function fetchStocks(int $offset, int $limit, ?string $search = null): array {
     global $pdo;
    $where = '';
    $params = [];
    if ($search !== null && $search !== '') {
        $where = ' WHERE p.name LIKE ? OR CAST(p.id AS CHAR) LIKE ?';
        $q = '%' . $search . '%';
        $params = [$q, $q];
    }
    $categoryJoin = '';
    $categorySelect = "'' AS category";
    try {
        $colStmt = $pdo->query("SHOW COLUMNS FROM product LIKE 'category_id'");
        if ($colStmt->fetch()) {
            $categoryJoin = ' LEFT JOIN category c ON c.id = p.category_id';
            $categorySelect = 'COALESCE(c.name, \'—\') AS category';
        }
    } catch (Throwable $e) {
        // ignore
    }
    $stmt = $pdo->prepare("
    SELECT 
        p.id AS productId,
        p.name AS name,
        {$categorySelect},
        s.quantity AS stock,
        s.selling_price AS sellingPrice,
        CASE 
            WHEN s.quantity < 200 THEN 'Low Stock'
            WHEN s.quantity > 1000 THEN 'High Stock'
            ELSE 'In Stock'
        END AS status
    FROM product AS p INNER JOIN stock AS s ON p.id = s.product_id{$categoryJoin}{$where}
    ORDER BY p.id DESC
    " . \App\Helpers\EntitySchema::sqlLimitOffset($limit, $offset) . "
    ");

    $stmt->execute($params);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function countStocksFiltered(?string $search = null): int
{
    global $pdo;
    $where = '';
    $params = [];
    if ($search !== null && $search !== '') {
        $where = ' WHERE p.name LIKE ? OR CAST(p.id AS CHAR) LIKE ?';
        $q = '%' . $search . '%';
        $params = [$q, $q];
    }
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM product p INNER JOIN stock s ON p.id = s.product_id{$where}");
    $stmt->execute($params);
    return (int) $stmt->fetchColumn();
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
        SELECT quantity AS stock
         FROM stock 
         WHERE product_id = ?
    ");

    $stmt->execute([$productId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$result){
        throw new Exception("Failed to get product quantity");
    }

    return $result['stock'];

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

    return $result['sellingPrice'] ?? 0;
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

public function increaseStock(array $stockRows): void
{
    global $pdo;
    $stmt = $pdo->prepare("
        UPDATE stock
        SET quantity = quantity + ?
        WHERE product_id = ?
    ");

    foreach ($stockRows as $row) {
        $stmt->execute([(int) $row['quantity'], (int) $row['productId']]);
    }
}

}
