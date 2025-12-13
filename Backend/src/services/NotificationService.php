<?php
    namespace App\Services;

    use App\Contracts\MailableInterface;
    use App\Contracts\MailSender;
    class NotificationService{
        public function __construct(
             private MailSender $mail
        )
       {}

       public function notify(MailableInterface $mail): bool{
        return $this->mail->send($mail);
       }


    }

    ?>