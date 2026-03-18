<?php
       namespace App\Models;
       use PDO;
class PurchaseItemsModel{
   
    public function __construct() {
      
    }

    public function addItems(array $purchaseItems) {
        foreach($purchaseItems as $purchaseItem){
            $placeholders[] = "(?, ?, ?, ?, ?)";
            $values[] = $purchaseItem['product_id'];
            $values[] = $purchaseItem['purchase_id'];
            $values[] = $purchaseItem['quantity'];
            $values[] = $purchaseItem['unit_price'];
            $values[] = $purchaseItem['item_subtotal'];
        }
        global $pdo;
        $stmt = $pdo->prepare("
            INSERT INTO purchase_items (product_id, purchase_id, quantity, unit_price, item_subtotal)
            VALUES" . explode(',' , $placeholders));

        $stmt->execute($values);
        return ['success' => true];
    }
}
