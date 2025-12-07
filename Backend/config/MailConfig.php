<?php

require __DIR__. '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../Backend/index.php';

function createMailer(){
    
$mail = new PHPMailer(true);

try{
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'] ?? null;
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'] ?? null;
    $mail->Password =$_ENV['SMTP_PASSWORD'] ?? null;
    $mail->SMTPSecure = $_ENV['SMTP_SECURE'] ?? null;
    $mail->Port = $_ENV['SMTP_PORT'] ?? null;

    if(!$mail->Host){
        throw new Exception("SMTP variable missings");
    }

    

    $mail->setFrom($_ENV['SMTP_USER'], "Bikas khanal");

    return $mail;

}catch (Exception $e) {
    echo "Message could set up mail. Mailer Error: {$mail->ErrorInfo}";
}
}
?>