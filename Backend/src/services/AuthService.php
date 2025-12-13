<?php 

    namespace App\Services;
    use App\Services\SanitizationService;
    use App\Services\ValidationService;
    use App\Models\UserModel;
    class AuthService{
       private $user;

        public function __construct(){
            $this->user = new UserModel();
        }
        //creating new account for the company
        public function createCompanyAccount($input){
            //sanitization 
          $rawName =  SanitizationService::string($input['name']);
          $rawEmail=   SanitizationService::email($input['email']);
         $rawPhnNbr=   SanitizationService::string($input['phoneNbr']);

         //validation
        $company['name']=  ValidationService::name($rawName);
        $company['email']=  ValidationService::email($rawEmail);
        $company['phnNbr']= ValidationService::phnNbr($rawPhnNbr);

        if($company['name'] === false){
            return json_encode([
                'success' => false,
                'message'=> 'Invalid name'
            ]);

        }

        if($company['email'] === false){
            return json_encode([
                'success' => false,
                'message' => 'Invalid email'
            ]);

        }

        if($company['phnNbr'] === false){
            return json_encode([
                'success' => false,
                'message' => 'Invalid phone number'
            ]);
        }
        //crate verification code store information in redis
        
        //validate comany info by email 


        //call db

        }

        
        //login validation for the user
        public function loginValidate($input){
            //sanitization for input
            $rawEmail = SanitizationService::email($input['email']);
            $rawPassword = SanitizationService::password($input['password']);

            //validation for input
            $mail = ValidationService::email($rawEmail);
            $password = ValidationService::password($rawPassword);

            if(!$mail && !$password){
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid name or password format'
                ]);
            }
            //db Call
         $userInfo=   $this->user->getByEmail($mail);
         if(!password_verify($password, $userInfo['user_password_hash'])){
            return json_encode([
                'success' => false,
                'message' => 'Incorrect password'
            ]);
         }

         //return the success = true with the role of the user


        }


        public function signupValidate($input){
            //sanitize , validate , store in redis , send mail , then store in db
            //sanitization
         $rawName=   SanitizationService::string($input['name']);
         $rawEmail= SanitizationService::email($input['email']);
         $rawPhnNbr= SanitizationService::string($input['phnNbr']);

         //validation
        $user['name']  = ValidationService::name($rawName);
         $user['email']=  ValidationService::email($rawEmail);
        $user['phnNbr']=  ValidationService::phnNbr($rawPhnNbr);

        if($user['name'] === false){
            return json_encode([
                'success' => false,
                'message' => 'Invalid name',
            ]);
        }

        if($user['email'] === false){
             return json_encode([
                'success' => false,
                'message' => 'Invalid email',
            ]);

        }


        if($user['phnNbr'] === false){
             return json_encode([
                'success' => false,
                'message' => 'Invalid phone number',
            ]);
        }





        }

        }

?>