<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require __DIR__. '/../config/redis.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once __DIR__.'/Mail/MailService.php';


$userData = json_decode(file_get_contents("php://input"), true);

$businessName = $userData["businessName"];
$businessMail = $userData["businessMail"];
$phoneNumber = $userData["phoneNumber"];

//TODO:need to do validatiaon and sanitization with database query


function sanitize($data)
{
    return htmlspecialchars(stripslashes(trim($data)));

}

$businessName = sanitize($businessName);
$businessMail = sanitize($businessMail);
$phoneNumber = sanitize($phoneNumber);

if (empty($businessName) || empty($businessMail) || empty($phoneNumber)) {
    echo json_encode([
        "success" => false,
        "message" => "All fields required",
    ]);

    exit;
}


$businessName = filter_var($businessName, FILTER_SANITIZE_STRING);
$businessMail = filter_var($businessMail, FILTER_SANITIZE_EMAIL);
$phoneNumber = filter_var($phoneNumber, FILTER_SANITIZE_NUMBER_INT);


//VALIDATION FOR INPUTS

$businessMail = filter_var($businessMail, FILTER_VALIDATE_EMAIL);

function phoneNumValidation($phoneNumber)
{
    $phnNbrRegex = "/^(98|97)\d{8}$/";
    return preg_match($phnNbrRegex, $phoneNumber) === 1;
}

$isPhoneValid = phoneNumValidation($phoneNumber);





if ($isPhoneValid && $businessMail) {

// OTP generation and storing in redis
$generatedOtp = rand(100000, 999999);

$redisKey = "otp:". $businessMail;
$redis->setex($redisKey, 300, $generatedOtp);

$subject = "Registration email verification";
$body =  "The otp for verification is ". $redisKey;

$response = MailService($businessMail, $businessName, $subject, $body);

if($response['success']){
    echo json_encode([
        "success" => true,
    ]);


}else{
    echo json_encode([
        "success" => false,
        "message" => "email failed to send",
    ]);
}



//updating state after successful registraton
    echo json_encode([
        "success" => true,
        "user" => [
            "userId" => 1234,
            "userEmail" => $businessMail,
            "userName" => $businessName,
            "userNumber" => $phoneNumber,
        ],
    ]);

} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email or phone number",
    ]);
}













?>