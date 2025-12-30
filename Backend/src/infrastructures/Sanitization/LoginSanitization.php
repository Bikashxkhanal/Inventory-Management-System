<?php 
namespace App\Infrastructures\Sanitization;
use App\Contracts\Sanitization;

class LoginSanitization extends Sanitization{
    public function  sanitize(array $input): array{
        return [
            'email' => filter_var($input['username'] ?? '', FILTER_SANITIZE_EMAIL),
            'password' => trim($input['password'] ?? ''),
        ];

    }
}