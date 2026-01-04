<?php

    namespace App\Domain\Users\Entities;
    use App\Domain\Users\Entities\Permission;
    class Role{
        private string $role;
      

        public function __construct($role){
            $this->role = $role;

        }

        public function getName(){
            return (string) $this->role;
        }

        public function getRoles() {
            $roles = require_once __DIR__ . '/../../config/rolesandpermissions.php';
            return $roles;
        }

        public function hasPermission(permission $permissionName):bool{

            $rolewithpermissions = require_once __DIR__ . '/../../config/rolesandpermissions.php';
            $permissions = $rolewithpermissions['roles'][$this->role];
            return (bool) in_array($permissionName->getName(), $permissions);
          
        }


    }





?>