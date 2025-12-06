<?php 

require __DIR__ .'/../vendor/autoload.php';
use Predis\Client as PredisClient;

$redis = new PredisClient([
     'schema' => 'tcp',
    'host' => '127.0.0.1',
    'port' => 6379,
]);


?>