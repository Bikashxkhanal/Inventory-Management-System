<?php
namespace App\Helpers;

use PDO;

class PurchaseSchema
{
    private static ?array $purchaseColumns = null;
    private static ?array $itemColumns = null;
    private static ?string $itemsTable = null;

    public static function purchaseColumns(): array
    {
        if (self::$purchaseColumns === null) {
            global $pdo;
            $stmt = $pdo->query('SHOW COLUMNS FROM purchase');
            self::$purchaseColumns = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
        }

        return self::$purchaseColumns;
    }

    public static function hasPurchaseColumn(string $column): bool
    {
        return in_array($column, self::purchaseColumns(), true);
    }

    public static function purchaseItemsTable(): string
    {
        if (self::$itemsTable !== null) {
            return self::$itemsTable;
        }

        global $pdo;
        $stmt = $pdo->query("SHOW TABLES LIKE 'purchase_items'");
        if ($stmt->fetch()) {
            self::$itemsTable = 'purchase_items';
            return self::$itemsTable;
        }
        $stmt = $pdo->query("SHOW TABLES LIKE 'purchase_item'");
        if ($stmt->fetch()) {
            self::$itemsTable = 'purchase_item';
            return self::$itemsTable;
        }

        self::$itemsTable = 'purchase_items';
        return self::$itemsTable;
    }

    public static function purchaseItemColumns(): array
    {
        if (self::$itemColumns === null) {
            global $pdo;
            $table = self::purchaseItemsTable();
            $stmt = $pdo->query("SHOW COLUMNS FROM `{$table}`");
            self::$itemColumns = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
        }

        return self::$itemColumns;
    }

    public static function hasPurchaseItemColumn(string $column): bool
    {
        return in_array($column, self::purchaseItemColumns(), true);
    }

    /** Resolved price column on line items (unit_price or price). */
    public static function itemPriceColumn(): string
    {
        foreach (['unit_price', 'price', 'unitPrice'] as $candidate) {
            if (self::hasPurchaseItemColumn($candidate)) {
                return $candidate;
            }
        }

        return 'price';
    }

    /** Subtotal column if present, else null (computed as qty * price). */
    public static function itemSubtotalColumn(): ?string
    {
        foreach (['subtotal', 'item_subtotal', 'line_total'] as $candidate) {
            if (self::hasPurchaseItemColumn($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    public static function supportsRejectedStatus(): bool
    {
        if (!self::hasPurchaseColumn('status')) {
            return false;
        }

        global $pdo;
        $stmt = $pdo->query("SHOW COLUMNS FROM purchase LIKE 'status'");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || empty($row['Type'])) {
            return false;
        }

        return stripos((string) $row['Type'], 'rejected') !== false;
    }

    public static function canSetStatus(string $status): bool
    {
        $status = strtolower(trim($status));
        $allowed = ['draft', 'completed'];
        if (self::supportsRejectedStatus()) {
            $allowed[] = 'rejected';
        }

        return in_array($status, $allowed, true);
    }

    public static function reset(): void
    {
        self::$purchaseColumns = null;
        self::$itemColumns = null;
        self::$itemsTable = null;
    }
}
