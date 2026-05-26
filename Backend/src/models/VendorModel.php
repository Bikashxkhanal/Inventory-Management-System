<?php 
    namespace App\Models;

    use App\Domain\Vendor\Vendor;
    use DomainException;
    use Exception;
    use PDO;

class VendorModel {

    public function __construct() {
      
    }

    public function fetchAll() {
            global $pdo;
        $stmt = $pdo->query("SELECT id, name FROM vendor ORDER BY name ASC");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function fetchCatalog(int $page, int $limit, int $companyId,  ?string $search = null, ?string $viewerRole = null): array
    {
        global $pdo;
        $offset = ($page - 1) * $limit;
        $where = ['v.company_id = ?'];
        $params = [$companyId];

        if (\App\Helpers\EntitySchema::hasColumn('vendor', 'approval_status')) {
            if (strtolower((string) $viewerRole) !== 'superadmin') {
                $where[] = "(v.approval_status IS NULL OR v.approval_status = 'active')";
            }
        }
        if ($search) {
            $where[] = '(v.name LIKE ? OR CAST(v.id AS CHAR) LIKE ?)';
            $q = '%' . $search . '%';
            $params[] = $q;
            $params[] = $q;
        }
        $whereSql = implode(' AND ', $where);
        $approvalCol = \App\Helpers\EntitySchema::hasColumn('vendor', 'approval_status')
            ? 'v.approval_status AS approvalStatus'
            : "'active' AS approvalStatus";

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM vendor v WHERE {$whereSql}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $sql = "
            SELECT
                v.id,
                v.name,
                {$approvalCol},
                COALESCE(vol.total_amount, 0) AS purchaseVolume
            FROM vendor v
            LEFT JOIN (
                SELECT vendor_id, SUM(COALESCE(total_amount, 0)) AS total_amount
                FROM purchase
                GROUP BY vendor_id
            ) vol ON vol.vendor_id = v.id
            WHERE {$whereSql}
            ORDER BY purchaseVolume DESC, v.name ASC
        ";
        $limit = max(1, (int) $limit);
        $offset = max(0, (int) $offset);
        $sql .= \App\Helpers\EntitySchema::sqlLimitOffset($limit, $offset);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $maxVol = 0;
        foreach ($rows as $row) {
            $vol = (float) ($row['purchaseVolume'] ?? 0);
            if ($vol > $maxVol) {
                $maxVol = $vol;
            }
        }
        foreach ($rows as &$row) {
            $vol = (float) ($row['purchaseVolume'] ?? 0);
            $row['isTopSupplier'] =
                $maxVol > 0 && $vol >= $maxVol * 0.7 && $vol > 0 ? 1 : 0;
        }
        unset($row);

        return [
            'data' => $rows,
            'meta' => [
                'current_page' => $page,
                'total_pages' => $limit > 0 ? (int) ceil($total / $limit) : 1,
                'total_records' => $total,
            ],
        ];
    }

    public function createVendor(array $data, int $companyId, int $createdBy, string $creatorRole): int
    {
        global $pdo;
        $approval = strtolower($creatorRole) === 'superadmin' ? 'active' : 'pending';
        $cols = ['name'];
        $vals = [$data['name']];
        if (\App\Helpers\EntitySchema::hasColumn('vendor', 'approval_status')) {
            $cols[] = 'approval_status';
            $vals[] = $approval;
        }
        if (\App\Helpers\EntitySchema::hasColumn('vendor', 'created_by')) {
            $cols[] = 'created_by';
            $vals[] = $createdBy;
        }

        if (\App\Helpers\EntitySchema::hasColumn('vendor', 'company_id')) {
            $cols[] = 'company_id';
            $vals[] = $companyId;
        }
        $ph = implode(', ', array_fill(0, count($cols), '?'));
        $stmt = $pdo->prepare('INSERT INTO vendor (' . implode(', ', $cols) . ") VALUES ({$ph})");
        $stmt->execute($vals);
        return (int) $pdo->lastInsertId();
    }

    public function updateVendorRow(int $id, array $data): bool
    {
        global $pdo;
        if (!isset($data['name'])) {
            return false;
        }
        $stmt = $pdo->prepare('UPDATE vendor SET name = ? WHERE id = ?');
        $stmt->execute([$data['name'], $id]);
        return $stmt->rowCount() > 0;
    }

    public function softDeleteVendor(int $id): bool
    {
        global $pdo;
        \App\Helpers\EntitySchema::ensureApprovalStatusColumn('vendor');
        $stmt = $pdo->prepare("UPDATE vendor SET approval_status = 'inactive' WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public function setVendorApproval(int $id, bool $approve): bool
    {
        global $pdo;
        if (!\App\Helpers\EntitySchema::hasColumn('vendor', 'approval_status')) {
            return true;
        }
        $status = $approve ? 'active' : 'inactive';
        $stmt = $pdo->prepare('UPDATE vendor SET approval_status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        return $stmt->rowCount() > 0;
    }
}
