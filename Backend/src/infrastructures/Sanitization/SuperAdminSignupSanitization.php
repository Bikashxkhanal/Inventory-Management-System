<?php 

    namespace App\Infrastructures\Sanitization;
    use App\Contracts\Sanitization;

    class SuperAdminSignupSanitization extends Sanitization {
        public function sanitize(array $input): array{
            return [
                'firstName' => trim(string: $input['firstName']  ?? ''),
                'lastName' => trim(string: $input['lastName'] ?? '') ,
                'email' => filter_var(value: trim($input['email'] , FILTER_SANITIZE_EMAIL) ?? ''),
                'phoneNumber' => trim(string: $input['phoneNumber']?? '') ,
                'password' => trim($input['password']?? ''),
                'role' => trim($input['role']),
             ];

        }
    }