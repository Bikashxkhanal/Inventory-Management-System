<?php
namespace App\Models;

use App\Domain\PurchaseOrder\PurchaseOrder;
use DomainException;

class PurchaseOrderModel
{
    public function addPurchaseOrder(array $poDetails)
    {
        global $pdo;
        $stmt = $pdo->prepare("INSERT INTO purchaseOrder (po_title, po_discription, vendor_id, created_by) VALUES (?, ?, ? , ?)");
        $stmt->execute($poDetails);
        $lastInsertedPoId = $pdo->lastInsertId();
        if (!$lastInsertedPoId) {
            throw new DomainException('cannot create purchase order');
        }

        return $lastInsertedPoId;

    }

    public function addPoItems(array $poItemDetails)
    {
        
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, proposed_unit_price) VALUES (?,?,?,?)");
            if (!$stmt->execute($poItemDetails)) {
                throw new DomainException('failed to add sell items');
            }
            return ['success' => true];
    }
    

    //soft delete
    public function deletePo(int $poId)
    {
        global $pdo;
        $stmt = $pdo->prepare("UPDATE purchase_order SET is_deleted = ? WHERE po_id = ? ");
        $stmt->execute([true, $poId]);
        $affectedRow = $stmt->rowCount();
        if ($affectedRow === 0 || $affectedRow > 1) {
            throw new DomainException('couldnot delete po');
        }

    }

    //soft delete for purchase order items
    public function deletePoItems(int $poId)
    {
        global $pdo;
        $stmt = $pdo->prepare("UPDATE purchase_order_items SET is_deleted = ? WHERE purchase_order_id = ? ");
        if ($stmt->execute([true, $poId])) {
            throw new DomainException('Failed to delete item');
        }
        ;
    }
    public function updateTitle(string $title, int $poId)
    {
        global $pdo;
        $stmt = $pdo->prepare("UPDATE purchase_order SET po_title = ? WHERE po_id = ? ");
        $stmt->execute([$title, $poId]);
        $affectedRow = $stmt->rowCount();

        if ($affectedRow == 0 || $affectedRow > 1) {
            throw new DomainException("couldnot update po");
        }


    }
    public function updateDiscription(string $discription, int $poId)
    {
        global $pdo;
        $stmt = $pdo->prepare("UPDATE purchase_order SET po_discription = ? WHERE po_id = ? ");
        $stmt->execute([$discription, $poId]);
        $affectedRow = $stmt->rowCount();

        if ($affectedRow == 0 || $affectedRow > 1) {
            throw new DomainException("failed to update po");
        }

    }
    public function findPoById(int $id)
    {
        global $pdo;
        $stmt = $pdo->prepare("SELECT * FROM purchase_order WHERE po_id = ? AND is_deleted = ? ");
        $stmt->execute([$id, false]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);

    }
    public function isPurchaseOrderExist(int $id)
    {
        global $pdo;
        $stmt = $pdo->prepare("SELECT 1 FROM purchase_order WHERE po_id = ? AND is_deleted = ? LIMIT 1");
        $stmt->execute([$id, false]);
        return $stmt->fetchColumn() !== false;

    }
}