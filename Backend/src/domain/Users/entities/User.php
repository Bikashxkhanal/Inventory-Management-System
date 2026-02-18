<?php 

    namespace App\Domain\Users\Entities;
    use App\Domain\Users\Entities\Role;

    class User{
        //firstName, lastName, email , phoneNumber, isVerified, role, companyId, password_hash
        private string $email;
        private string $firstName;
        private string $lastName;
        private string $role;
        private int $isVerified;
        private int $companyId;
        private string $password_hash;
        private string $phoneNumber;
        private string $status; //active and inactive

        public function addUserDetails( array $user){
            $this->firstName = $user['firstName'] ?? "";
             $this->lastName = $user['lastName'] ?? "";
            $this->email = $user['email'] ?? "";
            $this->role = strtolower($user['role']) ?? "";
            $this->isVerified = $user['isVerified'] ?? 1;
            $this->phoneNumber = $user['phoneNumber'] ?? "";
            $this->companyId = $user['companyId'] ?? null;
            $this->password_hash = $user['password_hash'] ?? ""; 
            $this->status = $user['status'] ?? 'active';

        }


        public function getRole() {
            return $this->role;
        }

        public function deactivate(){
            $this->status = 'inactive';
        }

        public function getUserDetails(){
            return [
                'firstName' => $this->firstName,
                'lastName' => $this->lastName,
                'email' => $this->email,
                'phoneNumber' => $this->phoneNumber,
                'role' =>$this->role,
                'isVerified' => $this->isVerified,
                'password_hash' => $this->password_hash,
                'companyId' => $this->companyId,
                'status' => $this->status,
            ];
        }
    }

?>