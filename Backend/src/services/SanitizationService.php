<?php
    namespace App\Services;

    class SanitizationService{
        public static function email($email){
            return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
        }

        public static function password($password) { 
            return trim($password);
        }

        public static function integer($integer){
            return filter_var($integer, FILTER_SANITIZE_NUMBER_INT);
        }

        public static function string($string){
           
            return htmlspecialchars(strtolower(trim($string)), ENT_QUOTES, 'UTF-8');
        }

        public static function special($special){
            return htmlspecialchars($special, ENT_QUOTES, 'UTF-8');
        }
    }


?>