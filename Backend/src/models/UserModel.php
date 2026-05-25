<?php 
     namespace App\Models;
     use App\Models\CompanyModel;
     use App\Services\SessionService;
      use App\Domain\Session\SessionManager;
use App\Helpers\EntitySchema;
use Exception;
use DomainException;
use PDO;
use PDOException;
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
            $cols = ['firstName', 'lastName', 'role', 'isVerified', 'email', 'phoneNumber', 'companyId', 'password_hash'];
            $vals = [
                $user['firstName'],
                $user['lastName'],
                $user['role'],
                $user['isVerified'],
                $user['email'],
                $user['phoneNumber'],
                $user['companyId'],
                $user['password_hash'],
            ];
            if (EntitySchema::hasColumn('sys_user', 'status')) {
                $cols[] = 'status';
                $vals[] = $user['status'] ?? 'active';
            }
            $placeholders = implode(', ', array_fill(0, count($cols), '?'));
            $sql = 'INSERT INTO sys_user (' . implode(', ', $cols) . ') VALUES (' . $placeholders . ')';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($vals);
            return $pdo->lastInsertId();
        }

        public function isUserExists($email, $phoneNumber): bool
        {
            return $this->getDuplicateConflict($email, $phoneNumber) !== null;
        }

    /** Human-readable message if email or phone is already taken. */
    public function getDuplicateConflict(?string $email, ?string $phoneNumber, ?int $excludeId = null): ?string
    {
        global $pdo;

        if ($email !== null && $email !== '') {
            $sql = 'SELECT id FROM sys_user WHERE email = ?';
            $params = [$email];
            if ($excludeId !== null) {
                $sql .= ' AND id != ?';
                $params[] = $excludeId;
            }
            $sql .= ' LIMIT 1';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            if ($stmt->fetchColumn()) {
                return 'A user with this email already exists.';
            }
        }

        if ($phoneNumber !== null && $phoneNumber !== '') {
            $sql = 'SELECT id FROM sys_user WHERE phoneNumber = ?';
            $params = [$phoneNumber];
            if ($excludeId !== null) {
                $sql .= ' AND id != ?';
                $params[] = $excludeId;
            }
            $sql .= ' LIMIT 1';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            if ($stmt->fetchColumn()) {
                return 'A user with this phone number already exists.';
            }
        }

        return null;
    }

    public function getStaffMemberById(int $id): ?array
    {
        global $pdo;
        $stmt = $pdo->prepare("
            SELECT id, firstName, lastName, email, phoneNumber, role, status, isVerified
            FROM sys_user
            WHERE id = ? AND role IN ('admin', 'manager', 'salesperson')
            LIMIT 1
        ");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function updateStaffMember(int $id, array $data): bool
    {
        global $pdo;
        $sets = [];
        $vals = [];

        foreach (['firstName', 'lastName', 'email', 'phoneNumber', 'role'] as $field) {
            if (array_key_exists($field, $data) && $data[$field] !== '') {
                $sets[] = "{$field} = ?";
                $vals[] = $data[$field];
            }
        }

        if (empty($sets)) {
            return false;
        }

        $vals[] = $id;
        $sql = 'UPDATE sys_user SET ' . implode(', ', $sets)
            . " WHERE id = ? AND role IN ('admin', 'manager', 'salesperson')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($vals);
        return $stmt->rowCount() > 0;
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
public function fetchStaff(int $page, int $limit, array $filters = []): array
{
    global $pdo;
    $offset = ($page - 1) * $limit;

    $where = ["role IN ('admin', 'manager', 'salesperson')"];
    $params = [];

    $viewerRole = strtolower((string) ($filters['viewer_role'] ?? ''));
    if (EntitySchema::hasColumn('sys_user', 'status')) {
        $where[] = "(status IS NULL OR status != 'inactive')";
        if ($viewerRole !== 'superadmin') {
            $where[] = "(status IS NULL OR status = 'active')";
            $where[] = '(isVerified = 1 OR isVerified IS NULL)';
        }
    }

    if (!empty($filters['q'])) {
        $where[] = '(firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phoneNumber LIKE ?)';
        $q = '%' . $filters['q'] . '%';
        $params = array_merge($params, [$q, $q, $q, $q]);
    }

    if (!empty($filters['role'])) {
        $where[] = 'role = ?';
        $params[] = $filters['role'];
    }

    $joinCol = EntitySchema::hasColumn('sys_user', 'created_at') ? 'created_at' : 'id';
    if (!empty($filters['join_from'])) {
        if (EntitySchema::hasColumn('sys_user', 'created_at')) {
            $where[] = 'DATE(created_at) >= ?';
            $params[] = $filters['join_from'];
        }
    }
    if (!empty($filters['join_to'])) {
        if (EntitySchema::hasColumn('sys_user', 'created_at')) {
            $where[] = 'DATE(created_at) <= ?';
            $params[] = $filters['join_to'];
        }
    }

    $whereSql = implode(' AND ', $where);
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM sys_user WHERE {$whereSql}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    $selectCols = 'id, firstName, lastName, email, role, status, phoneNumber, isVerified';
    if (EntitySchema::hasColumn('sys_user', 'created_at')) {
        $selectCols .= ', created_at AS joinedAt';
    } else {
        $selectCols .= ', NULL AS joinedAt';
    }

    $limit = max(1, (int) $limit);
    $offset = max(0, (int) $offset);
    $limitSql = EntitySchema::sqlLimitOffset($limit, $offset);

    $stmt = $pdo->prepare("
        SELECT {$selectCols}
        FROM sys_user
        WHERE {$whereSql}
        ORDER BY id DESC
        {$limitSql}
    ");
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalPages = $limit > 0 ? (int) ceil($total / $limit) : 1;

    return [
        'data' => $data,
        'meta' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => $totalPages,
            'total_pages' => $totalPages,
        ],
    ];
}

public function softDeleteStaff(int $id): bool
{
    global $pdo;
    if (!EntitySchema::hasColumn('sys_user', 'status')) {
        throw new Exception('Staff status column is not available');
    }
    $stmt = $pdo->prepare("UPDATE sys_user SET status = 'inactive' WHERE id = ? AND role != 'superadmin'");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}

public function setStaffApproval(int $id, bool $approve): bool
{
    global $pdo;
    $status = $approve ? 'active' : 'inactive';
    $verified = $approve ? 1 : 0;
    $stmt = $pdo->prepare('UPDATE sys_user SET status = ?, isVerified = ? WHERE id = ? AND role IN (\'admin\', \'manager\', \'salesperson\')');
    $stmt->execute([$status, $verified, $id]);
    return $stmt->rowCount() > 0;
}


public function fetchStaffStats(): array
{
    global $pdo;
    // Get total staff count
    $inactive = EntitySchema::hasColumn('sys_user', 'status') ? " AND (status IS NULL OR status != 'inactive')" : '';
    $stmtTotal = $pdo->prepare("SELECT COUNT(*) as total FROM sys_user WHERE role IN ('admin', 'manager' , 'salesperson'){$inactive}");
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