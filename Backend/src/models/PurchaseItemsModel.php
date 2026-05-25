<?php
namespace App\Models;

use App\Helpers\PurchaseSchema;
use PDO;

class PurchaseItemsModel
{
    private function table(): string
    {
        return PurchaseSchema::purchaseItemsTable();
    }

    public function addItem(int $purchaseId, int $productId, int $quantity, float $unitPrice): float
    {
        global $pdo;
        $table = $this->table();
        $priceCol = PurchaseSchema::itemPriceColumn();
        $subtotalCol = PurchaseSchema::itemSubtotalColumn();
        $subtotal = $quantity * $unitPrice;

        $columns = ['purchase_id', 'product_id', 'quantity', $priceCol];
        $placeholders = ['?', '?', '?', '?'];
        $values = [$purchaseId, $productId, $quantity, $unitPrice];

        if ($subtotalCol !== null) {
            $columns[] = $subtotalCol;
            $placeholders[] = '?';
            $values[] = $subtotal;
        }

        $sql = sprintf(
            'INSERT INTO `%s` (%s) VALUES (%s)',
            $table,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        return $subtotal;
    }

    public function addItems(array $purchaseItems): array
    {
        if (empty($purchaseItems)) {
            return ['success' => true];
        }

        foreach ($purchaseItems as $row) {
            $this->addItem(
                (int) $row['purchase_id'],
                (int) $row['product_id'],
                (int) $row['quantity'],
                (float) ($row['unit_price'] ?? $row['price'] ?? 0)
            );
        }

        return ['success' => true];
    }

    public function getItemsByPurchaseId(int $purchaseId): array
    {
        global $pdo;
        $table = $this->table();
        $priceCol = PurchaseSchema::itemPriceColumn();
        $subtotalCol = PurchaseSchema::itemSubtotalColumn();

        $select = [
            'product_id',
            'quantity',
            "`{$priceCol}` AS unit_price",
        ];
        if ($subtotalCol !== null) {
            $select[] = "`{$subtotalCol}` AS item_subtotal";
        } else {
            $select[] = "(quantity * `{$priceCol}`) AS item_subtotal";
        }

        $sql = sprintf(
            'SELECT %s FROM `%s` WHERE purchase_id = ?',
            implode(', ', $select),
            $table
        );
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$purchaseId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteItemsByPurchaseId(int $purchaseId): void
    {
        global $pdo;
        $table = $this->table();
        $stmt = $pdo->prepare("DELETE FROM `{$table}` WHERE purchase_id = ?");
        $stmt->execute([$purchaseId]);
    }
}
