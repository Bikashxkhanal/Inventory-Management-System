<?php 
namespace App\Controllers;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;


class DashboardController{
  private  $sessionService;
    public function __construct(){
        $sessionManager = new SessionManager();
        $this->sessionService = new SessionService($sessionManager);
    }

    public function showDashboard(){
        if(!$this->sessionService->hasThisKey('user_role')){
            echo "login to system";
            exit;
        };

         $user_role =  $this->sessionService->get('user_role');
        if($user_role !== 'superadmin'){
             echo "other user";
             exit;

        }

        require_once __DIR__ . '/../views/dashboard/SuperAdminDashboard.php';  

    }
    
}