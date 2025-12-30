<?php 
namespace App\Infrastructures\Validation;

class ValidationMethods{
       public  function email($email){
            if(!isset($email)) return false;
            return filter_var(trim($email), FILTER_VALIDATE_EMAIL);
        }

        public function password($password){
            if(!isset($password)) return false;
           $password =  trim($password);
            if(strlen($password)< 8 || strlen($password)> 16) return false;
            if(!preg_match('/[A-Z]/', $password))return false;
            if(!preg_match('/[a-z]/', $password)) return false;
            if(!preg_match('/[0-9]/', $password)) return false;
            if(!preg_match('/[\W]/',$password)) return false;
            return $password;
        }

 

        public function name(String $name){
            if(!isset($name)) return false;
            if(strlen($name)< 3 || strlen($name) > 30) return false;
             return $name;
        }

        public function phoneNumber(String $number){
             if(!isset($number)) return false;
                if(!strlen($number) === 10) return false;
                if(!preg_match('/^(98|97)[0-9]{8}$/', $number)) return false;
                return $number;

        }
    
}