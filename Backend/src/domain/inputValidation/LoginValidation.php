<?php 
namespace App\Domain\InputValidation;

use App\Contracts\InputValidation;
use App\Domain\InputValidation\ValidationMethods;

class loginValidation extends InputValidation{
    private ValidationMethods $validationMethod ;
    public function __construct(){
        $this->validationMethod = new ValidationMethods();

    }
    public function validate(array $input): array|bool{
         
        $validatedInput = [
            'email' => $this->validationMethod->email($input['email']),
            'password' => $this->validationMethod->password($input['password']),
        ];
    
        if(in_array(false, $validatedInput, true)){
            return $validatedInput;  
        }
    
    return false;
    }
}