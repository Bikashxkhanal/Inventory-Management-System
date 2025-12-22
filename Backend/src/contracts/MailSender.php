<?php 
    namespace App\Contracts;
    interface MailSender{
      public  function send(MailableInterface $mail): bool;


    }


?>