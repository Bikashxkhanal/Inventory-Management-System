<?php 
    namespace App\Services;
    use App\Contracts\MailableInterface;
    use App\Contracts\MailSender;
   

    class MailService implements MailSender{
        private $mailer;

        public function __construct($mailer){
            $this->mailer = $mailer;
        }

        public function send(MailableInterface $mail): bool{
            $this->mailer->addAddress($mail->getReceipent());
            $this->mailer->Subject = $mail->getSubject();
            $this->mailer->Body = $mail->getBody();
            $this->mailer->isHTML($mail->isHTML());

            return $this->mailer->send();   


        }

    }

 
 
 ?>