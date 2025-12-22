<?php 

namespace App\Config;

class SessionConfig{
    private $session;
    public function __construct(){
        if($this->session == PHP_SESSION_NONE){
             session_start();
            }
        }

        
       

}

?>