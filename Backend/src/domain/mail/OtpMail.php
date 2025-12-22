<?php 
    namespace App\Domain\Mail;
    use App\Contracts\MailableInterface;
    class OtpMail implements MailableInterface{
        public function __construct(
            private string $receiver,
            private string $otp
        ){} 
        public function getReceipent(): string{
            return $this->receiver;
            
        }

        public function getSubject(): string{
            return 'Email Verification ';
        }

        public function  getBody():string{
            return "Your OTP code is " . $this->otp;
        }

        public function isHTML() : bool{
            return false;
        }

    }

?>