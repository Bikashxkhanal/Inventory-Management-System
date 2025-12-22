<?php
    namespace App\Controllers;
    use App\Services\AuthService;
    use Exception;
    use InvalidArgumentException;

    class AuthController{
        private $authenticate;
        public function __construct(){ 
            $this->authenticate = new AuthService();

        }

        //create a account for company(mailey add the info of company and create a super admin using signup siquentially)
        public function setupCompany($input){
            try{

            
           $this->authenticate->createCompanyAccount($input);
           http_response_code(201);
             echo json_encode([
            'success' => true,
            'user' => [
                'userId' => random_int(1000, 9999),
                "userEmail" => $input['email'],
                 "userName" =>$input['name'] ,
                 "userNumber" => $input['phoneNumber'],
            ],

        ]);

            }catch(InvalidArgumentException $e){
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                ]);
            }

           
        }

        public function login($input){
            $response = $this->authenticate->loginValidate($input);
            
        }

        public function signup($input){
           return $this->authenticate->signupValidate($input);
        }

        public function otpVerification($input){
            return $this->authenticate->OtpValidate($input);
        }

        // public function resendOtp(){


        // }

        // public function forgetPassword(){

        // }

        // public function resetPassword(){

        // }

        // public function logout(){

        // }
    }

?>