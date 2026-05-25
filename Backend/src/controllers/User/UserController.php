<?php
    namespace App\Controllers\User;
    use App\Services\User\UserService;
    use App\Services\SessionService;
    use App\Domain\Session\SessionManager;
    use Exception;

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

            } catch (Exception $e) {
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

        $sessionService = new SessionService(new SessionManager());
        $currentUser = $sessionService->get('user');
        $filters = [
            'q' => isset($_GET['q']) ? trim((string) $_GET['q']) : null,
            'role' => isset($_GET['role']) ? trim((string) $_GET['role']) : null,
            'join_from' => $_GET['join_from'] ?? null,
            'join_to' => $_GET['join_to'] ?? null,
            'viewer_role' => $currentUser['user']['role'] ?? '',
        ];

        $result = $this->userservice->fetchStaffService($page, $limit, $filters);

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

public function softDeleteStaff()
{
    try {
        $sessionService = new SessionService(new SessionManager());
        $currentUser = $sessionService->get('user');
        if (strtolower((string) ($currentUser['user']['role'] ?? '')) !== 'superadmin') {
            throw new Exception('Only superadmin can remove staff');
        }
        $id = (int) ($_GET['id'] ?? $_POST['id'] ?? 0);
        if ($id < 1) {
            throw new Exception('Invalid staff id');
        }
        $this->userservice->softDeleteStaffService($id);
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Staff removed from listing']);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

public function approveStaff()
{
    $this->handleStaffApproval(true);
}

public function rejectStaff()
{
    $this->handleStaffApproval(false);
}

public function getStaffDetail()
{
    try {
        $sessionService = new SessionService(new SessionManager());
        $currentUser = $sessionService->get('user');
        if (strtolower((string) ($currentUser['user']['role'] ?? '')) !== 'superadmin') {
            throw new Exception('Only superadmin can view staff details');
        }
        $id = (int) ($_GET['id'] ?? 0);
        if ($id < 1) {
            throw new Exception('Invalid staff id');
        }
        $staff = $this->userservice->getStaffByIdService($id);
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $staff]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

public function updateStaff()
{
    try {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
        if ($id < 1) {
            throw new Exception('Invalid staff id');
        }
        $this->userservice->updateStaffService($id, $input);
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Staff updated successfully']);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

private function handleStaffApproval(bool $approve)
{
    try {
        $sessionService = new SessionService(new SessionManager());
        $currentUser = $sessionService->get('user');
        if (strtolower((string) ($currentUser['user']['role'] ?? '')) !== 'superadmin') {
            throw new Exception('Only superadmin can approve or reject staff');
        }
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
        if ($id < 1) {
            throw new Exception('Invalid staff id');
        }
        $this->userservice->setStaffApprovalService($id, $approve);
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $approve ? 'Staff approved' : 'Staff rejected',
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}


    }



?>