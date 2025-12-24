<?php 
    namespace App\Infrastructures\Cache;
    use App\Contracts\TempUserInfoInterface;
    use Predis\Client as RedisClient;

    class TempUserInfo implements TempUserInfoInterface{
        private $redis;
        private $ttl = 1800;

        public function __construct(RedisClient $redis){
            $this->redis = $redis;
        }

        public function getKey($type, $identifier){
            return "user:{$type}:{$identifier}";

        }

        public function addUserInfo(string $type, string $identifier, array $info): bool{
            $key = $this->getKey( $type, $identifier);
            $value = json_encode($info, flags: JSON_THROW_ON_ERROR);
         return (bool) $this->redis->set($key, $value, 'EX', $this->ttl);

        }

        public function getUserInfo(string $type, string $identifier){
            $key = $this->getKey( $type, $identifier);
           $infostatus=  $this->getUserInfoExpiry($type, $identifier);
            if($infostatus <= 0)return false;

            $data = $this->redis->get($key);
           return $data ? json_decode($data, true) : false;
        }

        public function deleteUserInfo(string $type , string $identifier): bool{
            $key = $this->getKey($type, $identifier);
           return (bool) $this->redis->del($key);
        }


        public function getUserInfoExpiry($type, $identifier): int{
            $key = $this->getKey($type, $identifier);
            return $this->redis->ttl($key);
        }
    }


?>