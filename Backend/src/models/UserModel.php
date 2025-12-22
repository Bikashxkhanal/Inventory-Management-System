<?php 
     namespace App\Models;
    class UserModel{
        public function getByEmail($email){
            global $pdo;
          $stmt=  $pdo->prepare("SELECT * FROM sys_user WHERE email = ?");
          $stmt->execute([$email], );
          return $stmt->fetch(\PDO::FETCH_ASSOC);

        }

        public function create($user){
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO sys_user (user_fname, user_lname, user_role, user_email, user_phoneNo, user_password_hash) VALUES (?, ?, ? ,? , ?)");
            $stmt->execute([$user['fname'], $user['lname'], $user['user_role'], $user['email'], $user['phoneNbr'], $user['hashedPwd']]);
            

        }

        

    }


?>