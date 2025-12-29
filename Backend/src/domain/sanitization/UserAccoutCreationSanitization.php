<?php 

namespace App\Domain\Sanitization;

use App\Contracts\Sanitization;

class UserAccountCreationSanitization extends Sanitization{
    public function sanitize(array $input): array{
        return [
            'firstName' => trim($input['firstName'] ?? ''),
             'lastName' => trim($input['lastName'] ?? ''),
             'email' => filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL),
             'phoneNumber' => trim($input['phoneNumber'] ?? ''),
            'role' => trim($input['role'] ?? ''),
            
        

        ];
    }

}