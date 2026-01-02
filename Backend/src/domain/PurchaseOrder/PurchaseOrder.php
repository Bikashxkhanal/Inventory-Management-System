<?php 
namespace App\Domain\PurchaseOrder;
use App\Domain\Users\Entities\User;

class PurchaseOrder{
    private $purchaseOrderId;
    private $purchaseOrderTitle;
    private $purchaseOrderDiscription;
    private $purchaseOrderCreatedAt;
    private $purchaseOrderUpdatedAt;
    private $vendorId;
   private User $createdBy;
    public function __construct(array $poDetails){
        $this->purchaseOrderId = $poDetails['po_id'] ?? null;
        $this->purchaseOrderTitle = $poDetails['po_title'];
        $this->purchaseOrderDiscription = $poDetails['po_discription'];
        $this->purchaseOrderCreatedAt = $poDetails['po_createdAt'];
        $this->purchaseOrderUpdatedAt = $poDetails['po_updatedAt'];
        $this->vendorId = $poDetails['po_vendorId'];
        $this->createdBy = $poDetails['po_createdBy'];

    }
    public function getPoId(){
        return $this->purchaseOrderId;

    }

    public function getPoTitle(){
        return $this->purchaseOrderTitle;
    }

    public function getPoDiscription(){
        return $this->purchaseOrderDiscription;
    }

    public function getPoCreatedTime(){
        return $this->purchaseOrderCreatedAt;
    }

    public function getPoLastUpdatedTime(){
        return $this->purchaseOrderUpdatedAt;
    }

    public function getVendor(){
        return $this->vendorId;
    }

    public function getCreator(){
        return $this->createdBy;

    }

    public function updateTitle(string $updatedTitle){
        $this->purchaseOrderTitle = $updatedTitle;
    }

    public function updateDiscription(string $updatedDiscription){
        $this->purchaseOrderDiscription = $updatedDiscription;
    }

    public function getPurchaseOrderDetails(){
        return [
            'po_id' => $this->purchaseOrderId,
            'po_title'=>$this->purchaseOrderTitle ,
            'po_discription' => $this->purchaseOrderDiscription,
            'po_createdTime' => $this->purchaseOrderCreatedAt,
            'po_lastUpdatedTime' => $this->purchaseOrderUpdatedAt,
            'po_vendorId' => $this->vendorId,
            'po_creator' => $this->createdBy,
        ];
    }
    
}