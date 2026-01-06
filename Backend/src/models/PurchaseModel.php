<?php 
    namespace App\Models;
    use RuntimeException;
    use PDO;
    class PurchaseModel{
        public function __construct(){}

        public function savePurchase(array $purchaseDetails){
            global $pdo;
           $stmt = $pdo->prepare("INSERT INTO purchase (vendor_id , po_id, total_price, purchase_date) VALUES (?, ? ,?,?)");
           if(!$stmt->execute($purchaseDetails)){ // it should only contains  these 4 parameters 
            throw new RuntimeException('failed to save purchase details');
           }

          return $pdo->lastInsertId();   

        }
        public function savePurchaseItems(array $purchaseItemsDetails){
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO purchase_item (purchase_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
            if(!$stmt->execute($purchaseItemsDetails)){ //only contains these four details
                throw new RuntimeException('failed to save purchase items');
            };
        }
        public function updatePurchaseItems(){}

        public function isPurchaseExist(int $id){
            global $pdo;
          $stmt =  $pdo->prepare("SELECT 1 FROM purchase WHERE purchase_id = ? LIMIT 1");
          if(!$stmt->execute([$id])){
            throw new RuntimeException('failed to get purchase');
          };
          return $stmt->fetchColumn() !== false;
        }
        public function findPurchase(int $id){
            global $pdo;
           $stmt =  $pdo->prepare("SELECT * FROM purchase WHERE purchase_id = ? LIMIT 1");
          if(!$stmt->execute([$id])){
            throw new RuntimeException('faild to get purchase item');
          };

         return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        public function findPurchaseItems(int $id){
            global $pdo;
            $stmt = $pdo->prepare("SELECT * FROM purchase_items WHERE purchase_id = ?");
            if(!$stmt->execute([$id])){
             throw new RuntimeException('faild to get purchase item');
          };
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getAllPurchases(){
          global $pdo;
          $stmt = $pdo->prepare("SELECT * FROM purchase WHERE is_deleted = ?");
          $stmt->execute([false]);
        }
    }