<?php 

    namespace App\Domain\InputValidation;

    use App\Contracts\InputValidation;
    use App\Domain\InputValidation\ValidationMethods;

    class BusinessAccountCreationValidation extends InputValidation{
        private ValidationMethods $validate;
        public function __construct(){
            $this->validate = new ValidationMethods();
        }
        public function validate(array $input): array|bool {

            $validatedInput = [
                    'name' => $this->validate->name($input['name']),
                    'email' => $this->validate->email($input['email']),
                    'phoneNumber' => $this->validate->phoneNumber($input['phoneNumber']),
            ];

            if(!in_array(false, $validatedInput, true )){
                return $validatedInput;
            }
            
            return false;
        }

    }