<?php 

    namespace App\Infrastructures\Sanitization;
    use App\Contracts\Sanitization;

    class SuperAdminSignupSanitization extends Sanitization {
        public function sanitize(array $input): array{
            return [
                'firstName' => trim( $input['firstName']  ?? ''),
                'lastName' => trim( $input['lastName'] ?? '') ,
                'email' => filter_var( trim($input['email'] , FILTER_SANITIZE_EMAIL) ?? ''),
                'phoneNumber' => trim( $input['phoneNumber']?? '') ,
                'password' => trim($input['password']?? ''),
                'role' => trim($input['role']),
                'companyId' => trim($input['companyId']),
             ];

        }
    }