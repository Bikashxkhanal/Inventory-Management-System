<?php
    namespace App\Services\User;
    use App\Domain\Users\Entities\User;
    use App\Infrastructures\Sanitization\UserAccountCreationSanitization;
    use App\Domain\Session\SessionManager;
    use App\Models\UserModel;
    use App\Services\SanitizationService;
    use App\Services\SessionService;
    use App\Services\ValidationService;
    use App\Domain\Users\Policies\UserCreationPolicy;
    use Exception;
use DomainException;
use PDOException;
    use App\Infrastructures\Validation\UserAccountCreationValidation;

    class UserService{
        private $sanitizationService;
        private $validationService;
        private $userModel;
        

        public function __construct(){
            $this->sanitizationService = new SanitizationService();
            $this->validationService = new ValidationService();
            $this->userModel = new UserModel();
              
        }

        private function currentUser(): array
    {
        $sessionService = new SessionService(new SessionManager());
        $session = $sessionService->get('user');
        if (!$session || empty($session['user'])) {
            throw new Exception('Unauthorized');
        }
       return $session;
    }

       

        public function userAccountCreationService($input){
            //TODO add error handling here
            //sanitization 
            $userAccountsanitization = new UserAccountCreationSanitization();
             $sanitizedInput =  $this->sanitizationService->handleSanitization($input, $userAccountsanitization);

            //validation
            $userAccountValidation = new UserAccountCreationValidation();
            $validatedInput = $this->validationService->handleValidation($sanitizedInput, $userAccountValidation); 
            //must return either user values or false condition

            //check can user be created
            $userCreationPolicy = new UserCreationPolicy();
            //get role of the current user role from session(creator) and role to be created from the validated input

            //current user role
            $sessionService = new SessionService(new SessionManager());
           if(!$sessionService->hasThisKey('user')) {
            throw new Exception('invalid action');
           };


        $validatedInput['password_hash'] =   password_hash($validatedInput['password'], PASSWORD_BCRYPT);

    
            $currentUser = $this->currentUser();
    

            if(!$currentUser){
                throw new Exception("No logged in user found");
            }

             $validatedInput['companyId'] = $currentUser['company']['companyId'];
             $creatorRole = strtolower((string) ($currentUser['user']['role'] ?? ''));
             if ($creatorRole === 'superadmin') {
                 $validatedInput['isVerified'] = 1;
                 $validatedInput['status'] = 'active';
             } else {
                 $validatedInput['isVerified'] = 0;
                 $validatedInput['status'] = 'pending';
             }


            $staff = new User();
            $staff->addUserDetails($validatedInput);

            
           //actual checking of user creation 
            if(!$userCreationPolicy->canCreateUser($currentUser['user'], $staff)){
                throw new Exception('Cannot be created');
            };  
            
            $details = $staff->getUserDetails();
            $conflict = $this->userModel->getDuplicateConflict(
                $details['companyId'],
                $details['email'] ?? null,
                $details['phoneNumber'] ?? null
            );
            if ($conflict !== null) {
                throw new Exception($conflict);
            }

            try {
                $this->userModel->create($details);
            } catch (PDOException $e) {
                if ($e->getCode() === '23000' || (int) ($e->errorInfo[1] ?? 0) === 1062) {
                    throw new Exception(
                        $this->userModel->getDuplicateConflict(
                            $details['email'] ?? null,
                            $details['phoneNumber'] ?? null
                        ) ?? 'A user with this email or phone number already exists.'
                    );
                }
                throw $e;
            }
            return true;
        }


        public function fetchStaffService(int $page, int $limit, array $filters = []): array
{
        $user = $this->currentUser();
          return  $this->userModel->fetchStaff($page, $limit, $user['company']['companyId'], $filters);
        // $staffDetails['fullName'] = $staffDetails['firstName'] . " " . $staffDetails['lastName'];
       

 }

 public function fetchStaffStatsService(): array
{
    $user = $this->currentUser();
    return $this->userModel->fetchStaffStats($user['company']['companyId']);
}

public function softDeleteStaffService(int $id): void
{
    if (!$this->userModel->softDeleteStaff($id)) {
        throw new Exception('Staff could not be removed');
    }
}

public function setStaffApprovalService(int $id, bool $approve): void
{
    if (!$this->userModel->setStaffApproval($id, $approve)) {
        throw new Exception('Staff approval update failed');
    }
}

public function getStaffByIdService(int $id): array
{
    $staff = $this->userModel->getStaffMemberById($id);
    if (!$staff) {
        throw new Exception('Staff member not found');
    }
    return $staff;
}

public function updateStaffService(int $id, array $input): void
{
    $sessionService = new SessionService(new SessionManager());
    $currentUser = $sessionService->get('user');
    if (strtolower((string) ($currentUser['user']['role'] ?? '')) !== 'superadmin') {
        throw new Exception('Only superadmin can update staff');
    }

    $existing = $this->userModel->getStaffMemberById($id);
    if (!$existing) {
        throw new Exception('Staff member not found');
    }

    $email = $input['email'] ?? $existing['email'];
    $phone = $input['phoneNumber'] ?? $existing['phoneNumber'];
    $conflict = $this->userModel->getDuplicateConflict($email, $phone, $id);
    if ($conflict !== null) {
        throw new Exception($conflict);
    }

    $role = strtolower((string) ($input['role'] ?? $existing['role']));
    if ($role === 'superadmin') {
        throw new Exception('Cannot assign superadmin role');
    }

    $updated = $this->userModel->updateStaffMember($id, [
        'firstName' => trim((string) ($input['firstName'] ?? $existing['firstName'])),
        'lastName' => trim((string) ($input['lastName'] ?? $existing['lastName'])),
        'email' => trim((string) $email),
        'phoneNumber' => trim((string) $phone),
        'role' => $role,
    ]);

    if (!$updated) {
        throw new Exception('No changes were saved');
    }
}


    }

?>