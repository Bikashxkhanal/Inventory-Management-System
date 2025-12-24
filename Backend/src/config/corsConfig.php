<?php

    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH , DELETE, OPTIONS");
    header("Access-Control-Allow-Credentials: true");

    if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
        http_response_code(200);
        exit();
    }

    header("Content-Type: application/json");

?>