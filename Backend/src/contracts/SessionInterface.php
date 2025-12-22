<?php 

namespace App\Contracts;

interface SessionInterface{
    public function start();
    public function set($key, $value);
    public function get($key);
    public function has($key);
    public function destroy();
    public function regenerate();
    public function remove($key);
}


?>