<?php 

 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Headers: Content-Type");
 header("Access-Control-Allow-Methods: POST");
 header("Content-Type: application/json");

 $data = json_decode(file_get_contents("php://input"), true);

 $username = $data["username"];
 $password = $data["password"];

 //TODO:need to do validatiaon and sanitization with database query
 if(empty($username) || empty($password)){
    echo json_encode([
        "success" => false,
        "message" => "Username and password required",
    ]);
    exit;
 }


 echo json_encode(value: [
    "success" => true,
    "user" =>[
        "username" => "login successfull",
    ]
    
 ]);





?>