<?php

    namespace App\Domain\Entities;
    use App\Domain\Entities\Permission;
    class Role{
        private string $role;
      

        public function __construct($role, $permissions){
            $this->role = $role;

        }

        public function getName(){
            return (string) $this->role;
        }

        public function hasPermission(permission $permissionName):bool{

            $rolewithpermissions = require_once __DIR__ . '/../../config/rolesandpermissions.php';
            $permissions = $rolewithpermissions['roles'][$this->role];
            return (bool) in_array($permissionName->getName(), $permissions);
          
        }


    }





?>