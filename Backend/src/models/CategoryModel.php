<?php   
    namespace App\Models;

    use DomainException;
    use RuntimeException;
    use PDO;
  
class CategoryModel {  
    public function fetchAll() {
        global $pdo;
        $stmt = $pdo->query("SELECT id, name FROM category ORDER BY name ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(string $name): int
    {
        global $pdo;
        $check = $pdo->prepare('SELECT id FROM category WHERE LOWER(name) = LOWER(?) LIMIT 1');
        $check->execute([$name]);
        if ($check->fetchColumn()) {
            throw new \DomainException('Category already exists');
        }
        $stmt = $pdo->prepare('INSERT INTO category (name) VALUES (?)');
        $stmt->execute([$name]);
        return (int) $pdo->lastInsertId();
    }

    public function exists(int $id): bool
    {
        global $pdo;
        $stmt = $pdo->prepare('SELECT 1 FROM category WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return (bool) $stmt->fetchColumn();
    }
}
