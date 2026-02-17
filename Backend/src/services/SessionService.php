<?php 
    namespace App\Services;
    use App\Contracts\SessionInterface;
    class SessionService{
        private $session;
        public function __construct(SessionInterface $session){
            $this->session = $session;
        }
         public function createUserSession($user){
            $rolesWithPermissions = require_once __DIR__ . '/../config/rolesandpermissions.php';
            $this->session->start();
            $this->session->set('user', [
                'user' => [
                'id' => $user['id'],
                'role' => $user['role'],
                'email' => $user['email'],
                'name' => $user['firstName'] .  " " . $user['lastName'],
                'isAuthenticated' => $user['isVerified'],
                'isAuthorized' => $user['isVerified'],
                ],
                'company' => 
                [
                'companyId' => $user['company_id'],
                'companyName' => $user['company_name']
                ],
              'permissions' =>  $rolesWithPermissions['roles'][$user['role']],
               
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
        public function get( string $key) { //get the contextkey or any userinformation
            $this->session->start();
           return  $this->session->get($key) ?? null ;
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