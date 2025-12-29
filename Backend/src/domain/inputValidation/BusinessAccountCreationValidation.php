<?php 

    namespace App\Domain\InputValidation;

    use App\Contracts\InputValidation;

    class BusinessAccountCreationValidation extends InputValidation{
        public function validate(array $input): array|bool {
            function nameValidation($name){
                if(!isset($name)) return false;
                if(strlen($name)< 3 || strlen($name) > 30) return false;
                return $name;
            }

            function phoneNumberValidation(string $number){
                if(!isset($number)) return false;
                if(!strlen($number) === 10) return false;
                if(!preg_match('/^(98|97)[0-9]{8}$/', $number)) return false;
                return $number;

            }

            $validatedInput = [
                    'name' => nameValidation($input['name']),
                    'email' => filter_var($input['email'], FILTER_VALIDATE_EMAIL),
                    'phoneNumber' => phoneNumberValidation($input['phoneNumber']),
            ];

            if(!in_array(false, $validatedInput, true )){
                return $validatedInput;
            }
            
            return false;
        }

    }