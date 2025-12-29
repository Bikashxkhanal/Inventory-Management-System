<?php 
namespace App\Domain\InputValidation;

use App\Contracts\InputValidation;

class loginValidation extends InputValidation{
    public function validate(array $input): array|bool{
             function validatePassword($password): bool|string{
            if(!isset($password)) return false;
           $password =  trim($password);
            if(strlen($password)< 8 || strlen($password)> 16) return false;
            if(!preg_match('/[A-Z]/', $password))return false;
            if(!preg_match('/[a-z]/', $password)) return false;
            if(!preg_match('/[0-9]/', $password)) return false;
            if(!preg_match('/[\W]/',$password)) return false;
            return $password;
        }

        $validatedInput = [
            'email' => filter_var(trim($input['email']) ?? '', FILTER_VALIDATE_EMAIL),
            'password' => validatePassword($input['password']),
        ];
    
        if(in_array(false, $validatedInput, true)){
            return $validatedInput;  
        }
    
    return false;
    }
}