<?php 
    namespace App\Domain\Purchase;
    use App\Domain\Users\Entities\User;
    use Exception;
    class PurchasePolicy{
        private array $rolesWithPermissons;
        public function __construct(){
            $this->rolesWithPermissons[] = __DIR__ . '/../../config/rolesandpermissions.php';
            
        }
        public function canCreatePurchase(User $user){
           $userRole =  $user->getRole();
           if(!in_array('CREATE_PURCHASE', $this->rolesWithPermissons['roles'][$userRole])){
            throw new Exception('access denied');
           }
           return true;

        }
        public function canUpdatePurchase(User $user){
            $userRole =  $user->getRole();
           if(!in_array('CREATE_PURCHASE', $this->rolesWithPermissons['roles'][$userRole])){
            throw new Exception('access denied');
           }
           return true;
        }
    }