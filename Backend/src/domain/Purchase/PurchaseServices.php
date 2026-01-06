<?php 
    namespace App\Domain\Purchase;
    use App\Domain\Purchase\purchase;
    use App\Models\PurchaseModel;
    use DomainException;
    use RuntimeException;
    class PurchaseServices{
        public function __construct(private Purchase $purchase , private PurchaseModel $model){}
        public function createPurchase(){
            try{
                global $pdo;
                $pdo->beginTransaction();
               if( $this->model->isPurchaseExist($this->purchase->getPurchaseId())){
                throw new DomainException('purchase already exists');
               }
            $purchaseId =    $this->model->savePurchase($this->purchase->geDetailsForDb());

          $purchaseItems =  $this->purchase->getPurchaseItems();
          foreach($purchaseItems as $purchaseItem) {
            $purchaseItem['purchase_id'] = $purchaseId;
            $this->model->savePurchaseItems($purchaseItem); // must pass 4 params as array 
          }
            $pdo->commit();
            }catch(DomainException $e)
            {
                $pdo->rollBack();
                throw $e;

            }catch
            (RuntimeException $e){
                $pdo->rollBack();
                throw $e;

            }

        }
        
    }