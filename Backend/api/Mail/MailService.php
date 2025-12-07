<?php

require __DIR__.'/../../vendor/autoload.php';
require __DIR__.'/../../config/MailConfig.php';


function MailService($businessMail, $businessName, $subject, $body){
    $mail =  createMailer();
    $mail->addAddress($businessMail, $businessName);
    
    $mail->isHTML(false);
    $mail->Subject = $subject;
    $mail->Body = $body ;

   try{
    $mail->send();
    return ["success" =>  true];

   }catch(Exception $e){
    return ["success" => false,
    "error" => $mail->ErrorInfo,
   ];

}

}


?>