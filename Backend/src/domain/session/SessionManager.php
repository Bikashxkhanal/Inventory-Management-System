<?php 
    namespace App\Domain\Session;
    use App\Contracts\SessionInterface;

    class SessionManager implements SessionInterface{
        public function start(){
            if(session_status() === PHP_SESSION_NONE){
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
            if($_SESSION[$key]){
                unset($_SESSION[$key]);
                return true;
            }

            return false;
            
        }

    }


?>