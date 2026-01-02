<?php 
    namespace App\Domain\PurchaseOrder;
    use App\Domain\Users\Entities\User;
    use Exception;


    class PurchaseOrderPolicy{
        private $rolesWithPermissons = require_once __DIR__ . '/../../config/rolesandpermissions.php';

        public function __construct(private User $creator){}   

        public function canCreatePurchaseOrder(){
            $currentUserRole = $this->creator->getRole();
            if(!in_array('CREATE_PO', $this->rolesWithPermissons['roles'][$currentUserRole])) return false;
            return true;
        }
        public function canDeletePurchaseOrder(){
            $currentUserRole = $this->creator->getRole();
            if(!in_array('DELETE_PO', $this->rolesWithPermissons['roles'][$currentUserRole])) return false;
            return true;
        }
        public function canUpdatePurchaseOrder(){
             $currentUserRole = $this->creator->getRole();
             if(!in_array('UPDATE_PO', $this->rolesWithPermissons['roles'][$currentUserRole])) return false;
             return true;
        }

    
    }