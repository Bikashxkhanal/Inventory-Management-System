<?php
    namespace App\Controllers\User;
    use App\Services\User\UserService;

    class UserController{ 
        private UserService $userservice;

        public function __construct(){
            $this->userservice = new UserService();
        }

        public function createUserAccount($input){
            try{
                $this->userservice->userAccountCreationService($input);

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => "User Created Successfully!"
                ]);

            }catch(Exception $e){
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                ]);

            }
            

        }
public function fetchStaff()
{
    try {

        $page  = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;

        if ($page < 1 || $limit < 1) {
            throw new Exception("Invalid pagination parameters");
        }

        $result = $this->userservice->fetchStaffService($page, $limit);

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => ["data" => $result["data"],
            "meta" => $result["meta"]]
            
        ]);

    } catch (Exception $e) {

        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    }
}


public function fetchStaffStats()
{
    try {
        $result = $this->userservice->fetchStaffStatsService();

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $result
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    }
}



    }



?>