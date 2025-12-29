<?php
    namespace App\Domain\Policies;
    use App\Domain\Entities\Role;
    use App\Domain\Entities\User;
    class UserCreationPolicy{

        //ADD LIMIT TO ADMIN CREATION TO COUNT 3 (LATER)
       public static function canCreateUser(User $creator, Role $role, ){
            if($creator->getRole()->getName() === 'SUPER_ADMIN' && $role->getName() !== 'SUPER_ADMIN') return true;
            if($creator->getRole()->getName() === 'ADMIN' && !in_array($role->getName(),  ['SUPER_ADMIN' , 'ADMIN'])) return true;
            return false;
       }

       
    }






?>