<?php 
    namespace App\Models;

    use App\Domain\Vendor\Vendor;
    use DomainException;
class VendorModel {

    public function __construct() {
      
    }

    public function fetchAll() {
            global $pdo;
        $stmt = $pdo->query("SELECT id, name FROM vendor ORDER BY name ASC");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
