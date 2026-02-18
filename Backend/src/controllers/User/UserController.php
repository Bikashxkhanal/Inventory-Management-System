<?php
    namespace App\Controllers\User;
    use App\Services\User\UserService;

    class UserController{ 
        private UserService $userservice;

        public function __construct(){
            $this->userservice = new UserService();
        }

        public function createUserAccount($input){
            try{
                $this->userservice->userAccountCreationService($input);

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => "User Created Successfully!"
                ]);

            }catch(Exception $e){
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                ]);

            }
            

        }
    }



?>