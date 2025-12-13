<?php
    //required parameter for connectiong to the db
    $host = $_ENV['DB_HOST'];
    $username = $_ENV['DB_USER'];
    $pwd = $_ENV['DB_PASSWORD'];
    $dbname = $_ENV['DB_NAME'];
    $port = $_ENV['DB_PORT'];

    //db connection 

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8",$username, $pwd);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $th) {
        die("Db connection error" . $th->getMessage());
       
    }




?>