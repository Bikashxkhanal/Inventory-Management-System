<?php 
    namespace App\Domain\Vendor;
    use App\Domain\Users\Entities\User;

  

    class VendorCreationPolicy{
        private  $rolesWithPermissions = require_once __DIR__ . '/../../config/rolesandpermissions.php';
         
        public function canCreateVendor(User $creator): bool{
            $role = $creator->getRole();
            if(!in_array('CREATE_VENDOR', $this->rolesWithPermissions['roles'][$role] )) return false;
            return true;


        }

        public function canDeleteVendor(User $creator) : bool{
            
            $role = $creator->getRole();
            if(!in_array('DELETE_VENDOR', $this->rolesWithPermissions['roles'][$role] )) return false;
            return true;

        }

    }