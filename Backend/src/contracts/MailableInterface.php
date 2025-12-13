<?php
    namespace App\Contracts;
    interface MailableInterface{
        public function getReceipent();
        public function getSubject();
        public function getBody();
        public function isHTML();
    }




?>