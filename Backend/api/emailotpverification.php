<?php 

require __DIR__. '/../config/redis.php';

 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Headers: Content-Type");
 header("Access-Control-Allow-Methods: POST");
 header("Content-Type: application/json");

 $userOTP = json_decode(file_get_contents("php://input"), true);

$otp = $userOTP['otp'] ?? '';
$email = $userOTP['userEmail'];

 


 $redisKey = "otp:". $email;

 $storedOtp = $redis->get($redisKey);

 if($otp === $storedOtp){
    echo json_encode([
        "success" => true,
        "message" => "otp matched",
    ]);
 }else{
    echo json_encode([
        "success" => false,
        "message" => "otp didnot matched",
    ]);
 }



?>