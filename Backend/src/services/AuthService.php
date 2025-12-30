<?php 

    namespace App\Services;

    use App\Infrastructures\Sanitization\CreateBusinessAccountSanitization;
    use App\Infrastructures\Sanitization\LoginSanitization;
    use App\Infrastructures\Sanitization\SuperAdminSignupSanitization;
    use App\Domain\Session\SessionManager;
    use App\Models\CompanyModel;
    use App\Services\SanitizationService;
    use App\Services\ValidationService;
    use App\Models\UserModel;
    use App\Services\NotificationService;
    use App\Services\OtpService;
    use App\Config\RedisConfig;
    use App\Infrastructures\Cache\RedisOtpStore;
    use App\Domain\Mail\OtpMail;
    use App\Infrastructures\Cache\TempUserInfo;
    use DomainException;
    use Exception;
    use InvalidArgumentException;
    use App\Services\SessionService;
    use App\Infrastructures\Validation\loginValidation;
    use App\Infrastructures\Validation\SuperAdminSignupValidation;
    use App\Infrastructures\Validation\BusinessAccountCreationValidation;
    
    
  
    
   

    require_once __DIR__ . '/../config/envConfig.php';
    
    class AuthService{
       private $userModel;
       private $redis;
       private $redisStore;
       private $otpService;
       private $tempUserInfo;
       private $sessionService;

       private $companyModel;
       private $superAdminSignupSanitizer;
       private $sanitizationService;
       private $validationService;

        public function __construct(
           
        ){
            $this->userModel = new UserModel();
            $this->companyModel = new CompanyModel();
            $this->redis = RedisConfig::getInstance();
            $this->redisStore = new RedisOtpStore($this->redis);
            $this->otpService = new OtpService($this->redisStore);
            $this->tempUserInfo =  new TempUserInfo($this->redis);
            $sessionManager = new SessionManager(); //that handles session using php 
            $this->sessionService = new SessionService($sessionManager);
            
            $this->sanitizationService = new  SanitizationService();
            $this->validationService = new ValidationService();
            
        }
        //creating new account for the company
        public function createCompanyAccount($input){
            //sanitization 

         $businessSanitizer = new CreateBusinessAccountSanitization();
         $sanitizedInput =  $this->sanitizationService->handleSanitization($input, $businessSanitizer);

         //validation
         $businessValidator = new BusinessAccountCreationValidation();
        $company  = $this->validationService->handleValidation($sanitizedInput, $businessValidator);


        if($company['name'] === false){
           throw new InvalidArgumentException('Invalid name');

        }

        if($company['email'] === false){
           throw new InvalidArgumentException('Invalid email');

        }

        if($company['phnNbr'] === false){
           throw new InvalidArgumentException('Invalid phone number');
        }

        if(in_array(false, $company, true)){
         throw new InvalidArgumentException('Invalid user information');
        }

        //CHECK COMPANY EXISTANCE IN DB
        if($this->companyModel->isCompanyAccountExist($company['email'], $company['phnNbr'])){
         throw new DomainException('Company already exists');
        }

        //store information in redis 
        $this->tempUserInfo->addUserInfo("COMPANY_SIGNUP", $company['email'], $company);

        //crate verification code store information in redis
        $this->otpService->generateOTP("COMPANY_SIGNUP", $company['email']);
        
        $this->sessionService->createOtpTypeSession('COMPANY_SIGNUP', $company['email']);

        $mailer = createMailer();
        $mailSender = new MailService($mailer);
        $NotificatioinSerive = new NotificationService($mailSender);
        $OtpMail = new OtpMail($company['email'], $this->redisStore->getOtp('COMPANY_SIGNUP', $company['email']));
        $NotificatioinSerive->notify($OtpMail);

        return true;
        }

        //login validation for the user
        public function loginValidate($input){
            //sanitization for input
            $loginSanitization = new LoginSanitization();
          $sanitizedInput =  $this->sanitizationService->handleSanitization($input, $loginSanitization);

            //validation for input
            $loginValidator  = new loginValidation();
           $validatedUser =  $this->validationService->handleValidation($sanitizedInput, $loginValidator);        

            if($validatedUser['email'] === false) {
               throw new InvalidArgumentException("Invalid email format");}

            if($validatedUser['password'] === false){
               throw new InvalidArgumentException('invalid password format ');
            }

            if(in_array(false, $validatedUser, true)){
               throw new InvalidArgumentException('invalid username or password');
            }
            
            //db Call   
          $userInfo = $this->userModel->getByEmail($validatedUser['email']);

               if($userInfo === false || !$userInfo){
                  throw new DomainException('No user of such email');
               }
        
         if(!password_verify($validatedUser['password'], $userInfo['user_password_hash'])){
            throw new DomainException("wrong password");
         }
      
        $rolesWithPermission = require_once __DIR__ . '/../config/rolesandpermissions.php';
      $roles = array_keys($rolesWithPermission['roles']);

          if(!in_array($userInfo['user_role'],$roles)){
           throw new InvalidArgumentException('invalid role');
         }

         $permissions = $rolesWithPermission['roles'][$userInfo['user_role']];

         $user = [
            'identity' => [
            'user_id' => $userInfo['user_id'],
            'user_name' => $userInfo['user_fname'] . " " . $userInfo['user_lname'],
            'user_role' => $userInfo['user_role'],
            'companyId' => 10005,
            'user_email' => $userInfo['user_email']
            ],
            'isVerified' => true,
            'permissions' => $permissions,
         ];

        try {
         $this->sessionService->createUserSession($user);
      }catch(Exception $e){
         throw new Exception('couldnot create session');
      }

         //return the success = true with the role of the user
         return true;

        }

        public function superAdminSignup($input){
            //sanitize , validate , store in redis , send mail , then store in db
            //sanitization
        $superAdminSignupSanitizer = new SuperAdminSignupSanitization();
         $sanitizedInput= $this->sanitizationService->handleSanitization($input, $superAdminSignupSanitizer);

         //validation
         $superAdminValidator = new SuperAdminSignupValidation();
        $user =  $this->validationService->handleValidation($sanitizedInput, $superAdminValidator);
        

        if($user['fname'] === false  || $user['lname'] === false){
        throw new Exception("Invalid Name");
        }

        if($user['email'] === false){
            throw new InvalidArgumentException("Invalid email");

        }
        if($user['phnNbr'] === false){
            throw new InvalidArgumentException("Invalid phone number");
        }

        if(!$user['role']) throw new InvalidArgumentException('no role ');

        if(in_array(false, $user, true)){
         throw new InvalidArgumentException('Invalid user information');
        }

        if($this->userModel->isUserExists($user['email'], $user['phnNbr'])){
         throw new DomainException('User already exists');

        }

        $user['isVerified'] = true;

                //hasing password
        $user['hashedPwd'] = password_hash($user['password'], PASSWORD_BCRYPT);
      
      try{
         //$user['phnNbr'] , but current is $user['phoneNumber']
          $this->userModel->create($user);
      }catch(Exception $e){
         throw new DomainException($e->getMessage());
      }
     
      $this->sessionService->createUserSession($user);
        return true;

        }
        //method to validate otp 
        public function OtpValidate($input){ //expect both otp-code and useremail
            //get session otp context
            try{
            $type =  $this->sessionService->get('otp_context');
            $otp_email = $this->sessionService->get('otp_email');
            $userOrCompanyInfo = $this->tempUserInfo->getUserInfo($type, $input['companyEmail']);

            if(!$type || !$userOrCompanyInfo){
               throw new Exception('otp setup key not found');
            }
           $this->otpService->verifyOtp($type, $otp_email, $input['otp']); 

           switch($type){
            case 'COMPANY_SIGNUP' : 
                  $this->companyModel->createCompanyAccount($userOrCompanyInfo);
               break;

            case 'USER_SIGNUP' : 
               $this->userModel->create($userOrCompanyInfo);
               break;

            default : throw new Exception('wrong otp context type');
           }

         
           

         return true;

            }catch(Exception $e){
               throw new Exception($e->getMessage());
            }
        }


        public function logout() {
          $user =  $this->sessionService->hasThisKey('user');
           if($user === false){
            throw new Exception('no user');
           }
          $isUserDeleted =  $this->sessionService->delete('user');
          if($isUserDeleted === false){
            throw new Exception("Error Processing Request" );
   
          }
          return true;
        }

       

        }

?>