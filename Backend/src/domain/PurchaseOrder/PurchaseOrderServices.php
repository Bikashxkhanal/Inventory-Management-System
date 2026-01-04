<?php
namespace App\Domain\PurchaseOrder;
use App\Models\PurchaseOrderModel;
use DomainException;

class PurchaseOrderServices
{
    public function __construct(private PurchaseOrder $po, private PurchaseOrderModel $model)
    {
    }

    public function createPurchaseOrder()
    {
        global $pdo;
        try {
            $pdo->beginTransaction();
            if ($this->model->isPurchaseOrderExist($this->po->getPoId())) {
                throw new DomainException('purchase order exists');
            }
            $poId = $this->model->addPurchaseOrder($this->po->getPoDetailsForDb());

            foreach ($this->po->getPoItemsList() as $poItem) {
                $poItem['poId'] = $poId;
                $this->model->addPoItems($poItem);
            }

            $pdo->commit();


        } catch (DomainException $e) {
            $pdo->rollBack();
            throw ($e);
        }

    }
    public function updatePoDiscription()
    {
        try {
            if (!$this->model->isPurchaseOrderExist($this->po->getPoId())) {
                throw new DomainException('purchase order doesnot exist');
            }
            $this->model->updateDiscription($this->po->getPoDiscription(), $this->po->getPoId());
        } catch (DomainException $e) {
            throw new DomainException($e);
        }

    }

    public function updatePurchaseOrderTitle()
    {
        try {
            if (!$this->model->isPurchaseOrderExist($this->po->getPoId())) {
                throw new DomainException('purchase order doesnot exist');
            }
            $this->model->updateTitle($this->po->getPoTitle(), $this->po->getPoId());
        } catch (DomainException $e) {
            throw new DomainException($e);
        }

    }

    public function deletePurchaseOrder()
    {
        global $pdo;
        try {
            $pdo->beginTransaction();
            if (!$this->model->isPurchaseOrderExist($this->po->getPoId())) {
                throw new DomainException('couldnot find po');
            }
            $this->model->deletePoItems($this->po->getPoId());

            $this->model->deletePo($this->po->getPoId());

            $pdo->commit();
        } catch (DomainException $e) {
            $pdo->rollBack();
            throw new DomainException($e);
        }
    }
}