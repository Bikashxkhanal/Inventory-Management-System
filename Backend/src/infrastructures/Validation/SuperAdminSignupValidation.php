<?php 

namespace App\Infrastructures\Validation;

use App\Contracts\InputValidation;
use App\Domain\InputValidation\ValidationMethods;
class SuperAdminSignupValidation extends InputValidation{
    private ValidationMethods $validate;

    public function __construct(){
        $this->validate = new ValidationMethods();
    }
    public function validate(array $input): array{

        return [
            'firstName' => $this->validate->name($input['firstName']),
            'lastName' => $this->validate->name($input['lastName']),
            'email' => $this->validate->email($input['email']),
            'phoneNumber' => $this->validate->phoneNumber($input['phoneNumber']),
            'password' => $this->validate->password($input['password']),
        ];
    }
}