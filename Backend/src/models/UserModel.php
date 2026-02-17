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

        
    }


?>