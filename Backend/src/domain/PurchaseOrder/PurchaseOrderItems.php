<?php 
    namespace App\Domain\PurchaseOrder;
    class PurchaseOrderItems{

       private int $productId;
       private string $productName;
       private int $quantity;
       private float $unitPrice;
        public function __construct(int $productId , string $productName, int $quantity, float $unitPrice){
            $this->productId = $productId;
            $this->productName1 = $productName;
            $this->quantity = $quantity;
            $this->unitPrice = $unitPrice;
        }
      
        public function getDiscription(){
            return [
                'productId' => $this->productId,   
                'productName' => $this->productName, 
                'quantity' => $this->quantity,
                'unitPrice' => $this->unitPrice,
            ];
        }

        public function getProductId(){return $this->productId;}

        public function getQuantity(){
            return $this->quantity;
        }

        public function updateQuantity(int $quantity){
            $this->quantity = $quantity;
        }

        public function updateUnitPrice($unitPrice){
            $this->unitPrice = $unitPrice;
        }

        public function getUnitPrice(){
            return $this->unitPrice;
        }

        public function getItemSubTotal(): float{
            return $this->quantity * $this->unitPrice;
        }


        
    }