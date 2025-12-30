<?php 

    namespace App\Infrastructures\Validation;

    use App\Contracts\InputValidation;
    use App\Infrastructures\Validation\ValidationMethods;

    class BusinessAccountCreationValidation extends InputValidation{
        private ValidationMethods $validate;
        public function __construct(){
            $this->validate = new ValidationMethods();
        }
        public function validate(array $input): array {

            return [
                    'name' => $this->validate->name($input['name']),
                    'email' => $this->validate->email($input['email']),
                    'phoneNumber' => $this->validate->phoneNumber($input['phoneNumber']),
            ];

            
         
        }

    }