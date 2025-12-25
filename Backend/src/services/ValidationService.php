<?php 
    
    namespace App\Services;

    use ParentIterator;
    class ValidationService{
        public static function email($email){
            return filter_var(trim($email), FILTER_VALIDATE_EMAIL);
        }

        public static function password($password){
           $password =  trim($password);
            if(strlen($password)< 8 || strlen($password)> 16) return false;
            if(!preg_match('/[A-Z]/', $password))return false;
            if(!preg_match('/[a-z]/', $password)) return false;
            if(!preg_match('/[0-9]/', $password)) return false;
            if(!preg_match('/[\W]/',$password)) return false;
            return $password;
        }

 

        public static function name(String $name){
            if(strlen($name)<3 || strlen($name)> 30) return false;
            return $name;
        }

        public static function phnNbr(String $phnNbr){
            if(!preg_match('/^(98|97)[0-9]{8}$/', $phnNbr)) return false;
            return $phnNbr;

        }


       
    }


?>