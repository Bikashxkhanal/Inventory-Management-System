<?php 

namespace App\Config;

class SessionConfig{
    private $session;
    public function __construct(){
        session_start();
    }

}

?>