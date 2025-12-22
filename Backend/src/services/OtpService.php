<?php 

    namespace App\Services;

    use App\infrastructures\cache\RedisOtpStore;

    class OtpService{
      private int $generatedOtp;
      private RedisOtpStore $store;
    //calling the otp generating fuction self
      public function __construct(
        RedisOtpStore $store
      ){
        $this->store = $store;
      }
      //generte OTP code
      public function generateOTP($type , $useId){
        $this->generatedOtp = random_int(100000, 999999);
       $this->store->setOtp($type, $useId, $this->generatedOtp);


      }
      //verify generated OTP code 
      public function verifyOtp($type , $userId, $userOTP):bool{
      $otp =  $this->store->getOtp($type, $userId);
      if(!$otp) return false;
       if($otp !== $userOTP)return false;
       $this->store->deleteOtp($type, $userId);
       return true;

      }
    }


?>