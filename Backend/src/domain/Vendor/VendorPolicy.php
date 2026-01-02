<?php 
    namespace App\Domain\Vendor;
    use App\Domain\Users\Entities\User;

  

    class VendorPolicy{
        private  $rolesWithPermissions = require_once __DIR__ . '/../../config/rolesandpermissions.php';
         
        public function canCreateVendor( string $currentUserRole): bool{
            if(!in_array('CREATE_VENDOR', $this->rolesWithPermissions['roles'][$currentUserRole] )) return false;
            return true;
        }

        public function canDeleteVendor(string $currentUserRole) : bool{
            
            if(!in_array('DELETE_VENDOR', $this->rolesWithPermissions['roles'][$currentUserRole] )) return false;
            return true;

        }

        public function canUpdateVendor(string $currentUserRole){
          
            if(!in_array('UPDATE_VENDOR', $this->rolesWithPermissions['roles'][$currentUserRole] )) return false;
            return true;

        }

    }