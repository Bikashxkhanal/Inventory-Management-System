<?php 

    namespace App\Services;
    use App\Domain\Session\SessionManager;
    use App\Services\SanitizationService;
    use App\Services\ValidationService;
    use App\Models\UserModel;
    use App\Services\NotificationService;
    use App\Services\OtpService;
    use App\Config\RedisConfig;
    use App\Infrastructures\Cache\RedisOtpStore;
    use App\Domain\Mail\OtpMail;
    use App\Infrastructures\Cache\TempUserInfo;
    use Exception;
    use InvalidArgumentException;
   

    require_once __DIR__ . '/../config/envConfig.php';

   
    
    class AuthService{
       private $user;
       private $redis;
       private $redisStore;
       private $otpService;
       private $tempUserInfo;
       private $session;

        public function __construct(
           
         
        ){
            $this->user = new UserModel();
            $this->redis = RedisConfig::getInstance();
            $this->redisStore = new RedisOtpStore($this->redis);
            $this->otpService = new OtpService($this->redisStore);
            $this->tempUserInfo =  new TempUserInfo($this->redis);
            $this->session = new SessionManager();
            
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

        //store information in redis 
        $this->tempUserInfo->addUserInfo("signup", $company['email'], $company);

        //crate verification code store information in redis
        $this->otpService->generateOTP("companyAcc", $company['email']);

        //session for storing the otp type and otp mail
        $this->session->set('otp_context', 'COMPANY_SIGNUP');
        $this->session->set('otp_mail', $company['email']);

        $mailer = createMailer();
        $mailSender = new MailService($mailer);
        $NotificatioinSerive = new NotificationService($mailSender);
        $OtpMail = new OtpMail($company['email'], $this->redisStore->getOtp('companyAcc', $company['email']));
        $NotificatioinSerive->notify($OtpMail);

        return true;


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
               throw new InvalidArgumentException("Invalid name or password format");
            }
            //db Call
         $userInfo=   $this->user->getByEmail($mail);
         if(!password_verify($password, $userInfo['user_password_hash'])){
            throw new Exception("wrong password");
         }

         //return the success = true with the role of the user


        }


        public function signupValidate($input){
            //sanitize , validate , store in redis , send mail , then store in db
            //sanitization
         $rawfName=   SanitizationService::string($input['firstName']);
         $rawlName=   SanitizationService::string($input['lastName']);
         $rawEmail= SanitizationService::email($input['email']);
         $rawPhnNbr= SanitizationService::string($input['phoneNumber']);
         $rawPassword = SanitizationService::password($input['password']);
         $rawRole = SanitizationService::string($input['role']);

         //validation
        $user['fname']  = ValidationService::name($rawfName);
        $user['lname']  = ValidationService::name($rawlName);
         $user['email']=  ValidationService::email($rawEmail);
        $user['phnNbr']=  ValidationService::phnNbr($rawPhnNbr);
        $user['password'] = ValidationService::password($rawPassword);
        $user['role'] = $rawRole;

        if($user['fname'] === false || $user['lname'] === false){
        throw new Exception("Invalid Name");
        }

        if($user['email'] === false){
            throw new InvalidArgumentException("Invalid email");

        }
        if($user['phnNbr'] === false){
            throw new InvalidArgumentException("Invalid phone number");
        }

        //geneate otp code and store it in redis
        $this->tempUserInfo->addUserInfo("signup", $user['email'], $user);
        $this->otpService->generateOTP('signup', $user['email']);

        
        //mail service 
        $mailer = createMailer();
        $mailSender = new MailService($mailer);
        $NotificatioinSerive = new NotificationService($mailSender);
        $OtpMail = new OtpMail($user['email'], $this->redisStore->getOtp('signup', $user['email']));
        $NotificatioinSerive->notify($OtpMail);

        return true;

    
        }

        //method to validate otp 
        public function OtpValidate($type , $input){ 
            //expect both otp-code and useremail 
         $status=   $this->otpService->verifyOtp($type, $input['companyEmail'], $input['otp']);
         if($status === false){
            throw new Exception("wrong otp");
         }

         return true;
        }

       

        }

?>