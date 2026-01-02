<?php
namespace App\Domain\PurchaseOrder;
use App\Models\PurchaseOrderModel;
use DomainException;

class PurchaseOrderServices
{
    public function __construct(private PurchaseOrder $poDetails, private PurchaseOrderModel $model) {}
   
    public function createPurchaseOrder()
    {
        try {

            if ($this->model->isPurchaseOrderExist($this->poDetails->getPoId())) {
                throw new DomainException('purchase order exists');
            }
            $this->model->create($this->poDetails);

        } catch (DomainException $e) {
            throw new DomainException($e);
        }

    }
    public function updatePurchaseOrderDiscription()
    {
        try {
            if (!$this->model->isPurchaseOrderExist($this->poDetails->getPoId())) {
                throw new DomainException('purchase order doesnot exist');
            }
            $this->model->updateDiscription($this->poDetails->getPoDiscription());
        } catch (DomainException $e) {
            throw new DomainException($e);
        }

    }

    public function updatePurchaseOrderTitle()
    {
        try {
            if (!$this->model->isPurchaseOrderExist($this->poDetails->getPoId())) {
                throw new DomainException('purchase order doesnot exist');
            }
            $this->model->updateTitle($this->poDetails->getPoTitle());
        } catch (DomainException $e) {
            throw new DomainException($e);
        }

    }

    public function deletePurchaseOrder()
    {
        try {
            if (!$this->model->isPurchaseOrderExist($this->poDetails->getPoId())) {
                throw new DomainException('couldnot find po');
            }
            $this->model->delete($this->poDetails->getPoId());
        } catch (DomainException $e) {
            throw new DomainException($e);
        }
    }

}