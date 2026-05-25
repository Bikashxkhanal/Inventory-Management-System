<?php
    namespace App\Domain\Users\Policies;
    use App\Domain\Users\Entities\Role;
    use App\Domain\Users\Entities\User;
    class UserCreationPolicy{

        //ADD LIMIT TO ADMIN CREATION TO COUNT 3 (LATER)
       public static function canCreateUser(array $creator, User $staff)
       {
            $creatorRole = strtolower((string) ($creator['role'] ?? ''));
            $targetRole = strtolower((string) $staff->getRole());

            if ($targetRole === 'superadmin') {
                return false;
            }

            if ($creatorRole === 'superadmin') {
                return in_array($targetRole, ['admin', 'manager', 'salesperson'], true);
            }
            if ($creatorRole === 'admin') {
                return in_array($targetRole, ['manager', 'salesperson'], true);
            }
            if ($creatorRole === 'manager') {
                return $targetRole === 'salesperson';
            }
            return false;
       }

       
    }






?>