<?php
    namespace App\Controllers;
    use App\Services\AuthService;

    class AuthController{
        private $authenticate;
        public function __construct(){ 
            $this->authencticate = new AuthService();

        }

        //create a account for company(mailey add the info of company and create a super admin using signup siquentially)
        public function setupComany($input){
            $response = $this->authenticate->createCompanyAccount();



        }

        public function login($input){
            $response = $this->authenticate->loginValidate($input);
            
        }

        public function signup($input){
            $response = $this->authenticate->signupValidate();

        }

        public function otpVerification(){

        }

        public function resendOtp(){

        }

        public function forgetPassword(){

        }

        public function resetPassword(){

        }

        public function logout(){

        }
    }

?>