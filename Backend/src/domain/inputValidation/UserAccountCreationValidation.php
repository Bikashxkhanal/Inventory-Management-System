<?php 
namespace App\Domain\InputValidation;

use App\Contracts\InputValidation;
use App\Domain\InputValidation\ValidationMethods;

class UserAccountCreationValidation extends InputValidation{
    private ValidationMethods $validate;
    public function __construct(){
        $this->validate = new ValidationMethods();
    }
    public function validate(array $input): array|bool{
        $validatedInput = [
            'firstName' => $this->validate->name($input['firstName']),
            'lastName' => $this->validate->name($input['lastName']),
            'email' => $this->validate->email($input['email']),
            'phoneNumber' => $this->validate->phoneNumber($input['phoneNumber']),
            'role' => $this->validate->name($input['role']),
            
        ];

        if(!in_array(false, $validatedInput, true)) return $validatedInput;
        
        return false;

    }
}