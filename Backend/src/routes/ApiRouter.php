<?php

    namespace App\Routes;
    class ApiRouter{
        public function dispatch(string $uri, string $method){
            $routes = require_once __DIR__ . '/Api.php';
           $key = "{$method} {$uri}";

          if(!isset($routes[$key])){
            http_response_code(404);
            echo json_encode(   [
                'message' => 'page not found',
            ]);
          }

          [$class, $methodName] = $routes[$key];

          $input = json_decode(file_get_contents('php://input'), true) ?? [];

          $controller = new $class();
          $response = $controller->$methodName($input);
          // return json_encode($response);
        }
        
    }



?>