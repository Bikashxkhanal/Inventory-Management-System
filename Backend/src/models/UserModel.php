<?php 
     namespace App\Models;

     use PDO;
    class UserModel{
        
        public function getByEmail($email){
            global $pdo;
          $stmt=  $pdo->prepare("SELECT * FROM sys_user WHERE user_email = ?");
          $stmt->execute([$email] );
          return $stmt->fetch(PDO::FETCH_ASSOC);

        }

        public function create($user){
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO sys_user (user_fname, user_lname, user_role, user_email, user_phoneNo, user_password_hash) VALUES (?, ?, ? ,? , ?,? , ?)");
            $stmt->execute([$user['fname'], $user['lname'], $user['role'], $user['isVerified'], $user['email'], $user['phnNbr'], $user['hashedPwd']]);
            
        }

        public function isUserExists($email, $phoneNumber){
            global $pdo;
           $stmt =  $pdo->prepare("SELECT 1 FROM sys_user WHERE user_email = :email OR user_phoneNo = :phoneNumber LIMIT 1");
            $stmt->execute(['email' => $email, 'phoneNumber'=> $phoneNumber]);
          return  $stmt->fetchColumn() !== false;
        }

        

    }


?>