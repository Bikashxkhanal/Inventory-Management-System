<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . '/../src/config/corsConfig.php';
require_once __DIR__ . '/../src/config/envConfig.php';
require_once __DIR__ . '/../src/config/dbConfig.php';
require_once __DIR__ . '/../src/config/mailConfig.php';
require_once __DIR__ . '/../src/config/RedisConfig.php';


use App\Routes\ApiRouter;


    $url = $_SERVER['REQUEST_URI'] ?? '/';
 
    $url = parse_url($url, PHP_URL_PATH);


    if($url === ''){
    $url = '/';
    }

    $router = new ApiRouter();


    $router->dispatch($url, $_SERVER['REQUEST_METHOD']);


?>