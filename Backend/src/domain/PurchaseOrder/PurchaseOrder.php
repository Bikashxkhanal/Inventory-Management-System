<?php
namespace App\Domain\PurchaseOrder;
use App\Domain\Products\Product;
use App\Domain\Users\Entities\User;
use Exception;

class PurchaseOrder
{
    private $purchaseOrderId;
    private $purchaseOrderTitle;
    private $purchaseOrderDiscription;
    private $purchaseOrderCreatedAt;
    private $purchaseOrderUpdatedAt;
    private $vendorId;
    private array $purchaseOrderItems = [];
    private int $createdBy;
    public function __construct(array $poDetails)
    {
        $this->purchaseOrderId = $poDetails['po_id'] ?? null;
        $this->purchaseOrderTitle = $poDetails['po_title'];
        $this->purchaseOrderDiscription = $poDetails['po_discription'];
        $this->purchaseOrderCreatedAt = $poDetails['po_createdAt'];
        $this->purchaseOrderUpdatedAt = $poDetails['po_updatedAt'];
        $this->vendorId = $poDetails['po_vendorId'];
        $this->createdBy = $poDetails['po_creatorId'];

    }
    public function getPoId()
    {
        return $this->purchaseOrderId;
    }

    public function getPoTitle()
    {
        return $this->purchaseOrderTitle;
    }

    public function getPoDiscription()
    {
        return $this->purchaseOrderDiscription;
    }

    public function getPoCreatedTime()
    {
        return $this->purchaseOrderCreatedAt;
    }

    public function getPoLastUpdatedTime()
    {
        return $this->purchaseOrderUpdatedAt;
    }

    public function getVendorId()
    {
        return $this->vendorId;
    }

    public function getCreatorId()
    {
        return $this->createdBy;
    }

    public function addItems(PurchaseOrderItems $item)
    {
        $this->purchaseOrderItems[] = $item;
    }

    public function updateTitle(string $updatedTitle)
    {
        $this->purchaseOrderTitle = $updatedTitle;
    }

    public function updateDiscription(string $updatedDiscription)
    {
        $this->purchaseOrderDiscription = $updatedDiscription;
    }

    public function updateItemQuantity(int $productId, int $quantity)
    {
        foreach ($this->purchaseOrderItems as $purchaseOrderItem) {
            if ($purchaseOrderItem->getProductId() === $productId) {
                $purchaseOrderItem->updateQuanity($quantity);
                return;
            }

        }

        throw new Exception("product not found");

    }
    public function updateUnitPrice(int $productId, float $unitPrice)
    {
        foreach ($this->purchaseOrderItems as $item) {
            if ($item->getProductId() === $productId) {
                $item->updateUnitPrice($unitPrice);
                return;
            }
        }

        throw new Exception('couldonot found product');
    }

    public function getPurchaseOrderDetails()
    {
        return [
            'po_id' => $this->purchaseOrderId,
            'po_title' => $this->purchaseOrderTitle,
            'po_discription' => $this->purchaseOrderDiscription,
            'po_createdTime' => $this->purchaseOrderCreatedAt,
            'po_lastUpdatedTime' => $this->purchaseOrderUpdatedAt,
            'po_vendorId' => $this->vendorId,
            'po_creator' => $this->createdBy,
            'po_items' => $this->purchaseOrderItems,
        ];
    }

    public function getPoDetailsForDb(): array
    {
        return [
            'po_title' => $this->purchaseOrderTitle,
            'po_discription' => $this->purchaseOrderDiscription,
            'po_vendorId' => $this->vendorId,
            'po_creator' => $this->createdBy,
        ];

    }

    public function getPoItemsList(): array
    {
        return $this->purchaseOrderItems;
    }


}