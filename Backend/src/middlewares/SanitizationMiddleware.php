<?php
    namespace App\Middlewares;

    class SanitizationMiddleware{
        public static function sanitizeGlobal(){
            $_GET = filter_input_array(INPUT_GET, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        }
    }

?>