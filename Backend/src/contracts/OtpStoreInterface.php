<?php
    namespace App\Contracts;
   

    interface OtpStoreInterface{
        public function getKey(string $type, string $identifier);

        public function setOtp(string $type, string $identifier, string $otp);

        public function getOtp(string $type, string $identifier);

        public function deleteOtp(string $type, string $identifier);



    }
    
    ?>