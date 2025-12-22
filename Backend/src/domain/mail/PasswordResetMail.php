<?php 

    namespace App\domain\mail;
    use App\Contracts\MailableInterface;
    class PasswordResetMail implements MailableInterface{
        public function __construct(
            private string $receiver,
            private string $resetLink
        ){}

    

        public function getReceipent(): string{
            return $this->receiver;
        }

            public function getSubject(): string{
            return 'Password Reset Link';

        }

        public function getBody(): string{
            return "Your password reset link is {$this->resetLink}. Please do not share this mail to anyone.";

        }


        public function isHTML(): bool{
            return false;

        }
    }


?>