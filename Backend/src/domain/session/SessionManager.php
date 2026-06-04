<?php 
    namespace App\Domain\Session;
    use App\Contracts\SessionInterface;

    class SessionManager implements SessionInterface{
        public function start(bool $persistent = false){
            if(session_status() === PHP_SESSION_NONE){
                $lifetime = $persistent ? 60 * 60 * 24 * 30 : 0;
                session_set_cookie_params([
                    'lifetime' => $lifetime,
                    'path' => '/',
                    'domain' => $_ENV['NETWORK_IP'],
                    'secure' => false,
                    'httponly' => true,
                    'samesite' => 'Lax',
                ]);
                session_start();
            }
        }

        public function set($key, $value){
            $_SESSION[$key] = $value;
        }

        public function get($key){
            return $_SESSION[$key] ?? null;

        }

        public function has($key){
            return (bool) isset($_SESSION[$key]);
        }

        public function destroy(){
            session_unset();
            session_destroy();
        }

        public function regenerate(){
            session_regenerate_id(true);
        }

        public function remove($key){
            if(isset($_SESSION[$key])){
                unset($_SESSION[$key]);
                return true;
            }

            return false;
            
        }

    }


?>