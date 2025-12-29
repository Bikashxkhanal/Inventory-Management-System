<?php 
namespace App\Domain\Sanitization;
use App\Contracts\Sanitization;

class LoginSanitization extends Sanitization{
    public function  sanitize(array $input): array{
        return [
            'email' => filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL),
            'password' => trim($input['password'] ?? ''),
        ];

    }
}