<?php 
    namespace App\Domain\Vendor;

    class Vendor{
        private $id;
        private $name;
        private $address;
        private $phoneNumber;
        private $email;
        private $postalCode;


        public function __construct(int $id, string $name, string $address, string $phoneNumber, string $email, string $postalCode){
            $this->id = $id;
            $this->name = $name;
            $this->address = $address;
            $this->phoneNumber = $phoneNumber;
            $this->email = $email;
            $this->postalCode = $postalCode;
        }

        public function changeName(string $changeName){$this->name = $changeName;}
        public function changeAddress(string $newAddress){
            $this->address = $newAddress;
        }

        public function changePhoneNumber(string $phoneNumber){
            $this->phoneNumber = $phoneNumber;
        }
        public function changeEmail(string $email){
            $this->email  = $email;
        }

        public function changePostalCode(string $postalCode){
            $this->postalCode = $postalCode;
        }

        public function getId(){return $this->id;}
        public function getName(){return $this->name;}
        public function getEmail(){return $this->email;}
        public function getAddress(){return $this->address;}
        public function getPostalCode(){return $this->postalCode;}
        public function getPhoneNumber(){return $this->phoneNumber;}

        public function getVendorDetails(): array {
            return [
                'name' => $this->name,
                'email' => $this->email,
                'phoneNumber' => $this->phoneNumber,
                'address' => $this->address,
                'postalCode' => $this->postalCode,
            ];
        }
    }