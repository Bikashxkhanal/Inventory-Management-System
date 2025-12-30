<?php 
namespace App\Infrastructures\Validation;

use App\Contracts\InputValidation;
use App\Infrastructures\Validation\ValidationMethods;

class loginValidation extends InputValidation{
    private ValidationMethods $validationMethod ;
    public function __construct(){
        $this->validationMethod = new ValidationMethods();

    }
    public function validate(array $input): array{
         
        return [
            'email' => $this->validationMethod->email($input['email']),
            'password' => $this->validationMethod->password($input['password']),
        ];
    
    }
}