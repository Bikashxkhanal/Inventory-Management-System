<?php 
namespace App\Domain\Products;
use App\Domain\Users\Entities\User;

class ProductsPolicy{
   private  $rolesWithPermissons = require_once __DIR__ . '/../../config/rolesandpermissions.php';
    public function canCreateProduct(User $user){
       $currentRole = $user->getRole();
        if(!in_array('CREATE_PRODUCT' , $this->rolesWithPermissons['roles'][$currentRole]))return false;
        return true;
    }
    public function canDeleteProduct( User $user){
         $currentRole = $user->getRole();
        if(!in_array('DELETE_PRODUCT' , $this->rolesWithPermissons['roles'][$currentRole]))return false;
        return true;
    }
    public function canActivateProduct(User $user){
         $currentRole = $user->getRole();
        if(!in_array('ACTIVATE_PRODUCT' , $this->rolesWithPermissons['roles'][$currentRole]))return false;
        return true;
    }

    public function canUpdateProduct(User $user){
         $currentRole = $user->getRole();
        if(!in_array('UPDATE_PRODUCT' , $this->rolesWithPermissons['roles'][$currentRole]))return false;
        return true;

    }
}