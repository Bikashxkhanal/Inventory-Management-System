<?php
    namespace App\Domain\Mail;
    use App\Contracts\MailableInterface;

    class WelcomeMail implements MailableInterface{
        public function __construct(
            private string $receiver
        
        ){}

        public function getReceipent(): string{
            return $this->receiver;
        }

        public function getSubject(): string{
            return "Welcome to Beyond Limits";
        }

        public function getBody(): string{
            return "Thank you for choosing us for your
            bussiness.";
        }

        public function isHTML() : bool{
            return false;
        }

    }

?>