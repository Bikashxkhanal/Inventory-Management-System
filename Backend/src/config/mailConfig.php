
<?php 
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    function createMailer(){

    //mail configuration 
    $smtphost = $_ENV['SMTP_HOST'];
    $smtpuser = $_ENV['SMTP_USER'];
    $smtppwd = $_ENV['SMTP_PASSWORD'];
    $smtpport = $_ENV['SMTP_PORT'];
    $smtpsecure = $_ENV['SMTP_SECURE'];

    //

    $mail = new PHPMailer(true);
    try{
        $mail->isSMTP();
        $mail->Host = $smtphost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpuser;
        $mail->Password = $smtppwd;
        $mail->SMTPSecure = $smtpsecure;
        $mail->Port - $smtpport;

        $mail->setFrom($smtpuser, "Beyond Limits");

        return $mail;

    }catch(Exception $e){
        return "Couldnot set up mail". $e->getMessage();
    }

}


?>