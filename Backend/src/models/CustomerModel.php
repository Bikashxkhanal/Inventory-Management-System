<?php 
namespace App\Models;
use PDO;
use Exception ;


class CustomerModel {

    // find the customer by number and returns it
    public function findByPhoneNumber(string $phoneNumber){
        try {
            global $pdo;
            $stmt =  $pdo->prepare("
                SELECT * FROM customer WHERE phone_number = ?
            ");

            $stmt->execute([$phoneNumber]);
            $result =  $stmt->fetch(PDO::FETCH_ASSOC);
            return $result;


        } catch (\Throwable $th) {
          throw $th;
        }
    }


    //create customer
    public function create(string $phoneNumber){
        try {
            global $pdo;
            $stmt =  $pdo->prepare("
                INSERT INTO customer(phone_number) VALUES (?)
            ");

            $stmt->execute([$phoneNumber]);
            return ['success' => true, 'id' => $pdo->lastInsertId()];

        } catch (\Throwable $th) {
          throw $th;
        }
    }
}