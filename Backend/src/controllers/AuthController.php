<?php
    
    namespace App\Controllers;
    use App\Services\AuthService;
    use DomainException;
    use Exception;
    use InvalidArgumentException;


    define('BASE_URL', "projects/INVENTORY-MANAGEMENT-SYSTEM/backend");

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
            'company' => [
                'companyId' => random_int(1000, 9999),
                "companyEmail" => $input['businessMail'],
                 "companyName" =>$input['businessName'] ,
                 "companyNumber" => $input['phoneNumber'],
            ],

        ]);

            }catch(InvalidArgumentException $e){
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                ]);
            }catch(DomainException $e){
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }

            

           
        }

        public function login($input){
            try{
                 $this->authenticate->loginValidate($input);
                 //get user role and information(store in session do it in either authservice)

                 //show dashboard as the user role , with the information required for the dashborad(dbCall)
                 echo json_encode([
                    'success'=> true,
                    'message' => 'login successful'
                 ]);

            }catch(InvalidArgumentException $e){
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }catch(DomainException $e){
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }catch(Exception $e){
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }
            
            
        }

        public function signup($input){
            try{
             $this->authenticate->signupValidate($input);
             http_response_code(200);
             echo json_encode([
                'success' => true,
                'user' => [
                    'userId' => random_int(1000, 3000),
                    'userName' => $input['firstName'].''. $input['lastName'],
                    'userEmail' => $input['email'],
                ],
                // 'message' => 'user registration successful',
                ]);
            
            }
            catch(InvalidArgumentException $e){
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }catch(DomainException $e){
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                ]);
            }
            catch(Exception $e){
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Internal server error',
                ]);
            }
           
        }


        //otp validation for creating new bussiness account
        public function otpVerification($input){
            try{
                   $this->authenticate->OtpValidate($input);
                 http_response_code(201);
                 echo json_encode([
                    'success' => true,
                    'message' => 'opt verified',
                 ]);
             

            }catch(Exception $e){
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message'=> $e->getMessage(),
                ]);
            }
           
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