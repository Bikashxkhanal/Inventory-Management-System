<?php 
    namespace App\Models;

    use App\Domain\PurchaseOrder\PurchaseOrder;
    use DomainException;
    use DOMException;
    class PurchaseOrderModel{
        public function create(PurchaseOrder $po){
            global $pdo;
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO purchaseOrder () VALUES ()");
            $stmt->execute([]);
           $lastInsertId = $pdo->lastInsertId();
           if(!$lastInsertId) {
            $pdo->rollBack();
            throw new DomainException('cannot create purchase order');
           }

           $pdo->commit();
           return $lastInsertId;

        }
        public function delete(int $poId){
            global $pdo;
            $pdo->beginTransaction();
            $stmt =  $pdo->prepare("");
            $stmt->execute([]);
           $affectedRow = $stmt->rowCount();

          
            if($affectedRow ===  0 || $affectedRow > 1 ){
                $pdo->rollBack();
                throw new DomainException('couldnot delete po');
            }

            $pdo->commit();
        }
        public function updateTitle(string $title){
            global $pdo;
            $pdo->beginTransaction();
           $stmt = $pdo->prepare("");
           $stmt->execute([]);
        $affectedRow =   $stmt->rowCount();

        if($affectedRow == 0 || $affectedRow > 1){
            $pdo->rollBack();
            throw new DomainException("couldnot update po");
        }

        $pdo->commit();

        }
           public function updateDiscription(string $discription){
            global $pdo;
            $pdo->beginTransaction();
           $stmt = $pdo->prepare("");
           $stmt->execute([]);
        $affectedRow =   $stmt->rowCount();

        if($affectedRow == 0 || $affectedRow > 1){
            $pdo->rollBack();
            throw new DomainException("couldnot update po");
        }

        $pdo->commit();

        }
        public function findById(int $id){
            global $pdo;
           $stmt = $pdo->prepare("");
           $stmt->execute([]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);

        }
        public function isPurchaseOrderExist(int $id){
            global $pdo;
           $stmt =  $pdo->prepare("");
           $stmt->execute([]);
           return $stmt->fetchColumn() !== false;
            
        }
    }