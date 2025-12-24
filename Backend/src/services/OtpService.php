<?php 

    namespace App\Services;


    use App\Contracts\SessionInterface;
    use App\Domain\Session\SessionManager;
    use App\infrastructures\cache\RedisOtpStore;
    use Exception;

    class OtpService{
      private int $generatedOtp;
      private RedisOtpStore $store;
      private  $session;
    //calling the otp generating fuction self
      public function __construct(
        RedisOtpStore $store
        // SessionInterface $session,
      ){
        $this->store = $store;
        $sessionManager  = new SessionManager();
        $this->session = new SessionService($sessionManager) ;
      }
      //generte OTP code
      public function generateOTP($type , $useId){
        $this->generatedOtp = random_int(100000, 999999);
       $this->store->setOtp($type, $useId, $this->generatedOtp);


      }
      //verify generated OTP code 
      public function verifyOtp($type , $userId, $userOTP):bool{
      $otp =  $this->store->getOtp($type, $userId);
      if(!$otp)  throw new Exception('otp expried');
       if($otp !== $userOTP) throw new Exception('otp didont matched') ;
       $this->store->deleteOtp($type, $userId);
       $this->session->delete('otp_context'); // $type key must be otp_content
       $this->session->delete('otp_email'); //$email key must be otp_email

       return true;

      }
    }


?>