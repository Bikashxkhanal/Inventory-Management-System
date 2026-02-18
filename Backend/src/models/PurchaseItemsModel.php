<?php
       namespace App\Models;
       use PDO;
class PurchaseItemsModel{
   
    public function __construct() {
      
    }

    public function addItem($purchase_id, $product_id, $quantity, $price) {
        global $pdo;
        $subtotal = $quantity * $price;
        $stmt = $pdo->prepare("
            INSERT INTO purchase_items (purchase_id, product_id, quantity, price, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$purchase_id, $product_id, $quantity, $price, $subtotal]);
        return $subtotal;
    }
}
