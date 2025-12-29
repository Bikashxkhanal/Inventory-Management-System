<?php
    namespace App\Services;
    use App\Contracts\Sanitization;
    
    class SanitizationService{
        public function handleSanitization( array $input, Sanitization $sanitizer){
           return $sanitizer->sanitize($input);
    
    }

}

?>