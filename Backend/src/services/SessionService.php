<?php 
    namespace App\Services;
    use App\Contracts\SessionInterface;
    class SessionService{
        private $session;
        public function __construct(SessionInterface $session){
            $this->session = $session;
        }
         public function createUserSession($user){
            $this->session->start();
            $this->session->set('user_id', $user['user_id']);
            $this->session->set('user_role', $user['user_role']);
            $this->session->set('user_name', $user['user_name']);
            
        }

        public function createOtpTypeSession($otp_context, $otp_email){
            $this->session->start();
            $this->session->set('otp_context', $otp_context );
            $this->session->set('otp_email', $otp_email);
        }
        public function get( string $key){ //get the contextkey or any userinformation
            $this->session->start();
           return  $this->session->get($key);
        }
        public function delete($key){ //delete the context key
            $this->session->start();
            return (bool) $this->session->remove($key);
        }


        public function hasThisKey($key){ // check is the session variable set or not 
            $this->session->start();
            return $this->session->has($key);
        }

       
    }


?>