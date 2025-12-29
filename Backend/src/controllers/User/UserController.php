<?php
    namespace App\Controllers;
    use App\Services\User\UserService;

    class UserController { 
        private UserService $userservice;

        public function __construct(){
            $this->userservice = new UserService();
        }

        public function createUserAccount($input){
            try{
                $this->userservice->accountCreationService($input);

                http_response_code(200);
                echo json_encode([]);

            }catch(){

            }
            

        }
    }



?>