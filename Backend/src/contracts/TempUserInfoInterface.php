<?php 

    namespace App\Contracts;

    interface TempUserInfoInterface{

        public function getKey(string $type, string $identifier);
        public function addUserInfo(string $type, string $identifier, array $info): bool;

        public function getUserInfo(string $type, string $identifier);

        public function deleteUserInfo(string $type, string $identifier):bool;

        public function getUserInfoExpiry(string $type, string $identifier):int;
    }


?>