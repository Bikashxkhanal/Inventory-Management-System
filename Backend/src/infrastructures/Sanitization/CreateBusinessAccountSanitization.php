<?php 

namespace App\Infrastructures\Sanitization;
use App\Contracts\Sanitization;
class CreateBusinessAccountSanitization extends Sanitization{
    public function sanitize(array $input): array{
        return [
                'name' => trim($input['businessName'] ?? ''),
                'email' => trim($input['businessMail' ?? '']),
                'phoneNumber' => trim($input['phoneNumber'] ?? ''),
        ];
    }

}
