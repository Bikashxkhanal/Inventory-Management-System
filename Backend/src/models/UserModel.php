<?php 
     namespace App\Models;
     use App\Models\CompanyModel;
     use App\Services\SessionService;
      use App\Domain\Session\SessionManager;
use Exception;
use Exception\DomainException;
     use PDO;
    class UserModel{
        private $companyModel;
        private $sessionService;
        public function __construct(){
            $this->companyModel = new CompanyModel();
            $sessionManager = new SessionManager();
            $this->sessionService = new SessionService($sessionManager);
        }
        
        public function getByEmail($email){
            global $pdo;
          $stmt=  $pdo->prepare("SELECT * FROM sys_user WHERE email = ?");
          $stmt->execute([$email] );
          return $stmt->fetch(PDO::FETCH_ASSOC);

        }

    public function getbyId($id){
            global $pdo;

         $stmt = $pdo->prepare("
        SELECT 
            u.id,  
            u.firstName,
            u.lastName, 
            u.email, 
            u.phoneNumber, 
            u.role, 
            u.isVerified,
            c.company_id,
            c.company_name 
        FROM sys_user AS u
        INNER JOIN company_info AS c 
            ON u.companyId = c.company_id
        WHERE u.id = ?
    ");

    $stmt->execute([$id]);

     return $stmt->fetch(PDO::FETCH_ASSOC);
}


        public function create($user){
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO sys_user (firstName, lastName, role, isVerified , email, phoneNumber, companyId, password_hash) VALUES (?, ?, ? ,? , ?,? ,?, ?)");
            $stmt->execute([$user['firstName'], $user['lastName'], $user['role'], $user['isVerified'], $user['email'], $user['phoneNumber'],$user['companyId'], $user['password_hash']]);
            return $pdo->lastInsertId();
        }

        public function isUserExists($email, $phoneNumber){
            global $pdo;
           $stmt =  $pdo->prepare("SELECT 1 FROM sys_user WHERE email = :email OR phoneNumber = :phoneNumber LIMIT 1");
            $stmt->execute(['email' => $email, 'phoneNumber'=> $phoneNumber]);
          return  $stmt->fetchColumn() !== false;
        }

public function createUser($user){
            global $pdo;

$pdo->beginTransaction();

try {

    if (!$this->companyModel->isAccountExist($user['companyId'])) {
        throw new Exception("No such company found");
    }

     if ($this->isUserExists($user['email'], $user['phoneNumber'])) {
        throw new DomainException("User already exists");
    }

    $createdID = $this->create($user);

    $createdUser = $this->getById($createdID);

    if (!$createdUser) {
        throw new Exception("Failed to fetch created user");
    }

    $this->sessionService->createUserSession($createdUser);

    $pdo->commit();

} catch (Exception $e) {
    $pdo->rollBack();
    throw $e;
}

        }
public function fetchStaff(int $page, int $limit): array
{
    global $pdo;
    $offset = ($page - 1) * $limit;

    $countStmt = $pdo->prepare("
        SELECT COUNT(*) as total
        FROM sys_user 
        WHERE role IN ('admin', 'manager' , 'salesperson')
    ");

    $countStmt->execute();
    $total = (int) $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // 2️⃣ Get paginated data
    $stmt = $pdo->prepare("
        SELECT id, firstName, lastName, email, role, status, phoneNumber
        FROM sys_user
        WHERE role IN ('admin', 'manager' , 'salesperson')
        ORDER BY id DESC
        LIMIT :limit OFFSET :offset
    ");

    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        "data" => $data,
        "meta" => [
            "page" => $page,
            "limit" => $limit,
            "total" => $total,
            "totalPages" => $limit > 0 ? ceil($total / $limit) : 1
        ]
    ];
}


public function fetchStaffStats(): array
{
    global $pdo;
    // Get total staff count
    $stmtTotal = $pdo->prepare("SELECT COUNT(*) as total FROM sys_user WHERE role IN ('admin', 'manager' , 'salesperson')");
    $stmtTotal->execute();
    $total = (int) $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

    // Get count by role
    $stmtRoles = $pdo->prepare("
        SELECT role, COUNT(*) as count
        FROM sys_user WHERE role IN ('admin', 'manager' , 'salesperson')
        GROUP BY role

    ");
    $stmtRoles->execute();
    $roles = $stmtRoles->fetchAll(PDO::FETCH_ASSOC);

    $stats = [
        "total" => $total,
        "admin" => 0,
        "salesperson" => 0,
        "manager" => 0
    ];

    foreach ($roles as $role) {
        if ($role['role'] === 'admin') $stats['admin'] = (int)$role['count'];
        elseif ($role['role'] === 'salesperson') $stats['sales'] = (int)$role['count'];
        elseif ($role['role'] === 'manager') $stats['manager'] = (int)$role['count'];
    }

    return $stats;
}


        
    }


?>