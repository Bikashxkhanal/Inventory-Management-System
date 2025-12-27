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
            $this->session->set('user', [
                'identity' => [
                'user_id' => $user['identity']['user_id'],
                'user_role' => $user['identity']['user_role'],
                'user_name' => $user['identity']['user_name'],
                'companyId' => $user['identity']['companyId'],
                'user_email' => $user['identity']['user_email'],
                ], 
                'permissions' => $user['permissions'],
                'isAuthenticated' => $user['isVerified'],

            ]);


            // $this->session->set('user_role', $user['user_role']);
            // $this->session->set('user_name', $user['user_name']);
            // $this->session->set('companyId', $user['companyId'] );
            
            
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