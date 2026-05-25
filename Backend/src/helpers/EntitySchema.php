<?php
namespace App\Helpers;

use PDO;

class EntitySchema
{
    private static ?array $cache = [];

    public static function tableColumns(string $table): array
    {
        if (!isset(self::$cache[$table])) {
            global $pdo;
            $stmt = $pdo->query("SHOW COLUMNS FROM `{$table}`");
            self::$cache[$table] = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
        }
        return self::$cache[$table];
    }

    public static function hasColumn(string $table, string $column): bool
    {
        return in_array($column, self::tableColumns($table), true);
    }

    public static function clearTableCache(string $table): void
    {
        unset(self::$cache[$table]);
    }

    /** Adds approval_status when missing (migration 003). */
    public static function ensureApprovalStatusColumn(string $table): void
    {
        if (self::hasColumn($table, 'approval_status')) {
            return;
        }
        global $pdo;
        $pdo->exec(
            "ALTER TABLE `{$table}` ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'active'"
        );
        self::clearTableCache($table);
    }

    /** Safe LIMIT/OFFSET clause — PDO binds these as quoted strings otherwise. */
    public static function sqlLimitOffset(int $limit, int $offset): string
    {
        $limit = max(1, (int) $limit);
        $offset = max(0, (int) $offset);

        return " LIMIT {$limit} OFFSET {$offset}";
    }
}
