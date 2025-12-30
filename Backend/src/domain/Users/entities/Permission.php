<?php 

    namespace App\Domain\Users\Entities;
    class permission{
        private string $permission;

        public function __construct($permission){
            $this->permission = $permission;
        }

        public function getName(){
            return (string) $this->permission;
        }
    }





?>