<?php 
    
    namespace App\Services;
    use App\Contracts\InputValidation;
    class ValidationService{
        public function handleValidation(array $input , InputValidation $validatortype){
          return  $validatortype->validate($input);
        }     
    }
?>