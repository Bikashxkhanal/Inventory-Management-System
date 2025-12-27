<?php 
namespace App\Controllers;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;
use Exception;

class DashboardController{
  private  $sessionService;
    public function __construct(){
        $sessionManager = new SessionManager();
        $this->sessionService = new SessionService($sessionManager);
    }
  public function verifyUser(){
            try{ 
               $isUserExist =  $this->sessionService->hasThisKey('user') ;
                if(!$isUserExist){
                    throw new Exception('must login first');
                }
             $user = $this->sessionService->get('user');

            if(!in_array($user['identity']['user_role'], ['admin', 'superadmin', 'manager', 'salesperson'], true) ){
                throw new Exception('unauthorized user');
            }
             http_response_code(202);
            echo json_encode([
                'success' => true,
                'message' => 'dashboard access success',
                'user' => $user,
                'isUserAuthorized' =>  'authorized',
                ]);
            }catch(Exception $e){
                 http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'isUserAuthorized' => 'unauthorized',
                    'isOtpVerified' => $user['isVerified'],
                   
                ]);
            }
        }

}