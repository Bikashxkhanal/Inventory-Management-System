<?php
namespace App\Domain\Purchase;

use Exception;

class PurchasePolicy
{
    private array $rolesWithPermissions;

    public function __construct()
    {
        $this->rolesWithPermissions = require __DIR__ . '/../../config/rolesandpermissions.php';
    }

    private function rolePermissions(string $role): array
    {
        $role = strtolower($role);
        return $this->rolesWithPermissions['roles'][$role] ?? [];
    }

    public function canCreatePurchase(string $role): bool
    {
        return in_array('CREATE_PURCHASE', $this->rolePermissions($role), true);
    }

    public function canUpdatePurchase(string $role): bool
    {
        return in_array('UPDATE_PURCHASE', $this->rolePermissions($role), true);
    }

    public function canDeletePurchase(string $role): bool
    {
        return in_array('DELETE_PURCHASE', $this->rolePermissions($role), true);
    }

    public function canVerifyPurchase(string $role): bool
    {
        return in_array('VERIFY_PURCHASE', $this->rolePermissions($role), true);
    }

    public function assertCanCreate(string $role): void
    {
        if (!$this->canCreatePurchase($role)) {
            throw new Exception('Access denied: cannot create purchase');
        }
    }

    public function assertCanUpdate(string $role): void
    {
        if (!$this->canUpdatePurchase($role)) {
            throw new Exception('Access denied: cannot update purchase');
        }
    }

    public function assertCanDelete(string $role): void
    {
        if (!$this->canDeletePurchase($role)) {
            throw new Exception('Access denied: cannot delete purchase');
        }
    }

    public function assertCanVerify(string $role): void
    {
        if (!$this->canVerifyPurchase($role)) {
            throw new Exception('Access denied: cannot verify purchase');
        }
    }

    public function completesOnFinalize(string $role): bool
    {
        $role = strtolower($role);
        return in_array($role, ['admin', 'superadmin'], true);
    }
}
