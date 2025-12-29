<?php 

    namespace App\Contracts;

abstract class Sanitization{
    abstract public function sanitize(array $input): array;

    protected function cleanString(string $input){
        return htmlspecialchars(trim($input) , ENT_QUOTES, 'utf-8');
    }
}