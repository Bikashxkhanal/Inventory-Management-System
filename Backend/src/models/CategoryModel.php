<?php   
    namespace App\Models;

    use DomainException;
    use RuntimeException;
    use PDO;
  
class CategoryModel {  
    public function fetchAll() {
        global $pdo;
        $stmt = $pdo->query("SELECT id, name FROM category");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
