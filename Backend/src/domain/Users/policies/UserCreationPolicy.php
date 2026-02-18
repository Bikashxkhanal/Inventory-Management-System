<?php
    namespace App\Domain\Users\Policies;
    use App\Domain\Users\Entities\Role;
    use App\Domain\Users\Entities\User;
    class UserCreationPolicy{

        //ADD LIMIT TO ADMIN CREATION TO COUNT 3 (LATER)
       public static function canCreateUser(array $creator, User $staff, ){
            if($creator['role']=== 'superadmin' && ($staff->getRole()) !== 'superadmin') return true;
            if($creator['role'] === 'admin' && !in_array(($staff->getRole()),  ['superadmin' , 'admin'])) return true;
            return false;
       }

       
    }






?>