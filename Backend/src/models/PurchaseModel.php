<?php 
    namespace App\Models;
    use RuntimeException;
    use PDO;
    
class PurchaseModel {
    
    public function __construct() {
       
    }

    public function create($vendor_id, $purchase_date, $totalAmount) {
      global $pdo;
        $stmt = $pdo->prepare("
            INSERT INTO purchase (vendor_id, purchase_date, total_amount, status) 
            VALUES (?, ?, ?, ?) 
        ");
        $stmt->execute([$vendor_id, $purchase_date, $totalAmount, 'completed']);
        return $pdo->lastInsertId();
    }

    public function fetchPaginated($page, $limit) {
      global $pdo;
        $offset = ($page - 1) * $limit;
        $stmt = $pdo->prepare("
            SELECT * FROM purchase ORDER BY created_at DESC LIMIT ? OFFSET ?
        ");
        $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(2, (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function fetchStats() {
      global $pdo;
        $stmt = $pdo->query("
            SELECT 
                COUNT(*) AS total,
                SUM(status='draft') AS draft,
                SUM(status='completed') AS completed
            FROM purchase
        ");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateTotal($purchaseId, $amount) {
      global $pdo;
        $stmt = $pdo->prepare("UPDATE purchase SET total_amount = total_amount + ? WHERE id = ?");
        $stmt->execute([$amount, $purchaseId]);
    }


    public function getPurchaseAmountByDateRange(string $startDate, string $endDate){
     global $pdo;
     $stmt =   $pdo->prepare("
            SELECT SUM(total_amount) AS totalAmount
             FROM purchase
             WHERE status = 'completed'
             AND created_at BETWEEN ? AND ?
        ");

    $stmt->execute([$startDate, $endDate]);
    
    $result =  $stmt->fetch(PDO::FETCH_ASSOC) ;
    return $result['totalAmount'] ?? 0;
    }
}



        // public function savePurchase(array $purchaseDetails){
        //     global $pdo;
        //    $stmt = $pdo->prepare("INSERT INTO purchase (vendor_id , po_id, total_price, purchase_date) VALUES (?, ? ,?,?)");
        //    if(!$stmt->execute($purchaseDetails)){ // it should only contains  these 4 parameters 
        //     throw new RuntimeException('failed to save purchase details');
        //    }

        //   return $pdo->lastInsertId();   

        // }
        // public function savePurchaseItems(array $purchaseItemsDetails){
        //     global $pdo;
        //     $stmt = $pdo->prepare("INSERT INTO purchase_item (purchase_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
        //     if(!$stmt->execute($purchaseItemsDetails)){ //only contains these four details
        //         throw new RuntimeException('failed to save purchase items');
        //     };
        // }
        // public function updatePurchaseItems(){}

        // public function isPurchaseExist(int $id){
        //     global $pdo;
        //   $stmt =  $pdo->prepare("SELECT 1 FROM purchase WHERE purchase_id = ? LIMIT 1");
        //   if(!$stmt->execute([$id])){
        //     throw new RuntimeException('failed to get purchase');
        //   };
        //   return $stmt->fetchColumn() !== false;
        // }
        // public function findPurchase(int $id){
        //     global $pdo;
        //    $stmt =  $pdo->prepare("SELECT * FROM purchase WHERE purchase_id = ? LIMIT 1");
        //   if(!$stmt->execute([$id])){
        //     throw new RuntimeException('faild to get purchase item');
        //   };

        //  return $stmt->fetch(PDO::FETCH_ASSOC);
        // }
        // public function findPurchaseItems(int $id){
        //     global $pdo;
        //     $stmt = $pdo->prepare("SELECT * FROM purchase_items WHERE purchase_id = ?");
        //     if(!$stmt->execute([$id])){
        //      throw new RuntimeException('faild to get purchase item');
        //   };
        //     return $stmt->fetchAll(PDO::FETCH_ASSOC);
        // }

        // public function getAllPurchases(){
        //   global $pdo;
        //   $stmt = $pdo->prepare("SELECT * FROM purchase WHERE is_deleted = ?");
        //   $stmt->execute([false]);
        // }
    