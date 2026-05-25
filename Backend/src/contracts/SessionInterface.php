<?php 

namespace App\Contracts;

interface SessionInterface{
    /** @param bool $persistent When true, session cookie lasts ~30 days (remember me). */
    public function start(bool $persistent = false);
    public function set($key, $value);
    public function get($key);
    public function has($key);
    public function destroy();
    public function regenerate();
    public function remove($key);
}


?>