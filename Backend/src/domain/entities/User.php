<?php 

    namespace App\Domain\Entities;
    use App\Domain\Entities\Role;
    use App\Domain\Entities\Permission;

    class User{
        private string $email;
        private string $firstName;
        private string $lastName;
        private Role $role;
        private string $address;
        private bool $isActive;

        private string $phoneNumber;

        public function addUserDetails( array $user){
            $this->firstName = $user['firstName'];
             $this->lastName = $user['lastName'];
            $this->email = $user['email'];
            $this->role = $user['role'];
            $this->address = $user['address'] ?? null;
            $this->isActive = $user['isActive'] ?? true;
            $this->phoneNumber = $user['phoneNumber'];
        }


        public function getRole() {
            return $this->role;
        }

        public function deactivate(){
            $this->isActive = false;
        }

        public function getUserDetails(){
            return [
                'firstName' => $this->firstName,
                'lastName' => $this->lastName,
                'email' => $this->email,
                'phoneNumber' => $this->phoneNumber,
                'role' =>$this->role,
                'address' => $this->address ?? null,
                'isActive' => $this->isActive,
            ];
        }
    }

?>