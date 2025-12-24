<?php 

    namespace App\Services;

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
  
    
   

    require_once __DIR__ . '/../config/envConfig.php';
    
    class AuthService{
       private $userModel;
       private $redis;
       private $redisStore;
       private $otpService;
       private $tempUserInfo;
       private $sessionService;

       private $companyModel;

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
            
        }
        //creating new account for the company
        public function createCompanyAccount($input){
            //sanitization 
          $rawName =  SanitizationService::string($input['businessName']);
          $rawEmail=   SanitizationService::email($input['businessMail']);
         $rawPhnNbr=   SanitizationService::string($input['phoneNumber']);

         //validation
        $company['name']=  ValidationService::name($rawName);
        $company['email']=  ValidationService::email($rawEmail);
        $company['phnNbr']= ValidationService::phnNbr($rawPhnNbr);

        if($company['name'] === false){
           throw new InvalidArgumentException('Invalid name');

        }

        if($company['email'] === false){
           throw new InvalidArgumentException('Invalid email');

        }

        if($company['phnNbr'] === false){
           throw new InvalidArgumentException('Invalid phone number');
        }

        //CHECK COMPANY EXISTANCE IN DB
        if($this->companyModel->isCompanyAccountExist($company['email'], $company['phnNbr'])){
         throw new DomainException('Company already exists');
        }

        //store information in redis 
        $this->tempUserInfo->addUserInfo("COMPANY_SIGNUP", $company['email'], $company);

        //crate verification code store information in redis
        $this->otpService->generateOTP("COMPANY_SIGNUP", $company['email']);
        

        //session for storing the otp type and otp mail
      //   $this->session->set('otp_context', 'COMPANY_SIGNUP');
      //   $this->session->set('otp_mail', $company['email']);

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
            $rawEmail = SanitizationService::email($input['username']);
            $rawPassword = SanitizationService::password($input['password']);

            //validation for input
            $mail = ValidationService::email($rawEmail);
            $password = ValidationService::password($rawPassword);

            if($mail === false && $password === false) {
               throw new InvalidArgumentException("Invalid name or password format");}
            
            //db Call

         $userInfo = $this->userModel->getByEmail($mail);
         if($userInfo === false) {
            throw new DomainException('No user of such email');
         }


         if(!password_verify($password, $userInfo['user_password_hash'])){
            throw new DomainException("wrong password");
         }

         $user['user_id'] = $userInfo['user_id'];
         $user['user_name'] = $userInfo['user_fname']. " " . $userInfo['user_lname'];
         $user['user_role'] = $userInfo['user_role'];

         // switch ($userInfo['user_role']){
         //    case 'superadmin' : $this->sessionService->createSuperAdminSession($userInfo);
         //    break;

         //    case 'admin' : 
         //       break;

         //    case 'storemanager' : 
         //       break;


         //    default : throw new Exception('couldnot found the user type');
         // }

        try {
         $this->sessionService->createUserSession($user);
      }catch(Exception $e){
         throw new Exception('couldnot create session');
      }

         //return the success = true with the role of the user
         return true;


        }


        public function signupValidate($input){
            //sanitize , validate , store in redis , send mail , then store in db
            //sanitization
         $rawfName=   SanitizationService::string($input['firstName']);
         $rawlName=   SanitizationService::string($input['lastName']);
         $rawEmail= SanitizationService::email($input['email']);
         $rawPhnNbr= SanitizationService::string($input['phoneNumber']);
         $rawPassword = SanitizationService::password($input['password']);
         $user['role'] = SanitizationService::string($input['role']);

         //validation
        $user['fname']  = ValidationService::name($rawfName);
        $user['lname']  = ValidationService::name($rawlName);
         $user['email']=  ValidationService::email($rawEmail);
        $user['phnNbr']=  ValidationService::phnNbr($rawPhnNbr);
        $user['password'] = ValidationService::password($rawPassword);
        

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

        if($this->userModel->isUserExists($user['email'], $user['phnNbr'])){
         throw new DomainException('User already exists');

        }

                //hasing password
        $user['hashedPwd'] = password_hash($user['password'], PASSWORD_BCRYPT);
        //geneate otp code and store it in redis (if needed)
      //   $this->tempUserInfo->addUserInfo("USER_SIGNUP", $user['email'], $user);
      //   $this->otpService->generateOTP('USER_SIGNUP', $user['email']);

      //   $this->sessionService->createOtpTypeSession('USER_SIGNUP', $user['email']);

      try{
          $this->userModel->create($user);
      }catch(Exception $e){
         throw new DomainException($e->getMessage());
      }
     
      $this->sessionService->createSuperAdminSession($user);
         
        //mail service 
      //   $mailer = createMailer();
      //   $mailSender = new MailService($mailer);
      //   $NotificatioinSerive = new NotificationService($mailSender);
      //   $OtpMail = new OtpMail($user['email'], $this->redisStore->getOtp('USER_SIGNUP', $user['email']));
      //   $NotificatioinSerive->notify($OtpMail);

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

       

        }

?>