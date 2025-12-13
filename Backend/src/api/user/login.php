<?php 
    //loading the cors file (headers)
    require_once __DIR__ . '/../../config/corsConfig.php';

    $input = json_decode(file_get_contents("php://input"), true);

    //call userControllers for the further process
  

?>