<?php 

namespace App\Config;
use Predis\Client as RedisClient;

class RedisConfig{
    private static ?RedisClient $instance = null;
    public function __construct(){}

    public static function getInstance(): RedisClient {
        if(self::$instance === null){
            self::$instance = new RedisClient([
                  'schema' => 'tcp',
                 'host' => '127.0.0.1',
                'port' => 6379,
            ]);
        }
        return self::$instance;
    }
}


?>