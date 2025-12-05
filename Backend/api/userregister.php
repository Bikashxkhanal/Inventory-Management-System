<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Headers: Content-Type");
 header("Access-Control-Allow-Methods: POST");
 header("Content-Type: application/json");
$userData = json_decode(file_get_contents("php://input"), true);

$businessName = $userData["businessName"];
$businessMail = $userData["businessMail"];
$phoneNumber = $userData["phoneNumber"];

//TODO:need to do validatiaon and sanitization with database query

echo json_encode([
    "success" => true,
    "user" => [
        "company" => $businessMail,
    ],
]);


?>