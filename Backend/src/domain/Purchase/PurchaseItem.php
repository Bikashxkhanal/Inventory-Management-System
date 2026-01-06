<?php 
    namespace App\Domain\Purchase;
    class PurchaseItem{
        private int $productId;
        private string $productName;
        private int $quantity;
        private float $unitPrice;
        public function __construct(){}
        public function calculateTotal(): float|int{
            return $this->quantity * $this->unitPrice;
        }

        public function getProductId(){
            return $this->productId;
        }

        public function getProductName(){
            return $this->productName;
        }

        public function getQuantity(){
            return $this->quantity;
        }

        public function getUnitPrice(){
            return $this->unitPrice;
        }

        public function getPurchaseItemDetail(){
            return ['productId' => $this->productId, 
            'productName' => $this->productName,
            'quantity' => $this->quantity, 
            'unitPrice' =>  $this->unitPrice
        ];
        }
    }