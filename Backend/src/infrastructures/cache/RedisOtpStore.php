<?php 
    namespace App\Infrastructures\Cache;

    use App\Contracts\OtpStoreInterface;
    use Predis\Client as RedisClient;
    
    class RedisOtpStore implements OtpStoreInterface{
        private RedisClient $redis;
        private int $ttl = 120;
        public function __construct(RedisClient $redis){
            $this->redis = $redis;
        }

        public function getKey(string $type, string $userId){
          return  "otp:$type:$userId";

        }

        public function setOtp(string $type, string $userId , string $otp){
            $key  = $this->getKey($type, $userId);
            $this->redis->set($key, $otp, 'EX', $this->ttl);
        }

        public function getOtp(string $type, string $userId){
            $key = $this->getKey($type, $userId);
            return $this->redis->get($key) ?? null;

        }

        public function deleteOtp(string $type, string $userId){
                $key = $this->getKey($type, $userId);
                return (bool) $this->redis->del([$key]);
        }
    }

?>