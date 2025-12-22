<?php 
    namespace App\Services;
    use App\Contracts\SessionInterface;
    use App\Domain\Session\SessionManager;
    

    class SessionService{
        private SessionInterface $session;
        public function __construct(SessionInterface $session){
            $this->session = $session;
        }
         public function createSuperAdminSession($user){
            $this->session->start();
            $this->session->set('user_id', $user['id']);
            $this->session->set('role', 'SUPER_ADMIN');
        }

        public function createOtpTypeSession($otp_context, $otp_email){
            $this->session->start();
            $this->session->set('otp_context', $otp_context );
            $this->session->set('otp_email', $otp_email);
        }

        public function get($key){
            $this->session->start();
           return $this->session->get($key);
        }

        public function delete($key){
            $this->session->start();
            return (bool) $this->session->remove($key);
        }

    
    }


?>