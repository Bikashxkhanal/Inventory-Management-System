<?php 
    namespace App\Domain\Purchase;
    class purchase{
        private ?int $purchaseId;
        private int $vendorId;
        private int $purchaseOrderId;
        private float $totalPrice;
        private array $purchaseItems;

        public function __construct(array $purchaseDetails){
            $this->purchaseId = null;
            $this->vendorId = $purchaseDetails['vendorId'];
            $this->purchaseOrderId = $purchaseDetails['poId'];
            $this->totalPrice  = $purchaseDetails['totalPrice'];
            $this->purchaseItems = [];
            
        }

        //factory method for retrieving purchasedetails with items too
        public static function fromDatabase(array $purchaseDetails , array $purchaseItems):purchase{
            $purchase = new self($purchaseDetails);

            $purchase->purchaseId = $purchaseDetails['purchaseId'];
            $purchase->purchaseItems = $purchaseItems;

            return $purchase;

        }

        public function getPurchaseId(): int{return $this->purchaseId;}
        public function getVendorId(): int{return $this->vendorId;}
        public function getPurchaseOrderId(): int{return $this->purchaseOrderId;}
        public function getTotalPrice(): float{return $this->totalPrice;}
        public function getPurchaseItems(): array{return $this->purchaseItems;}    

    }