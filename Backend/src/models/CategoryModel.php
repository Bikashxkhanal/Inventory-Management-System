<?php   
    namespace App\Models;

    use DomainException;
    use RuntimeException;
    use PDO;
  
class CategoryModel {  
    public function fetchAll(int $companyId) {
        global $pdo;
        $stmt = $pdo->prepare("SELECT id, name FROM category WHERE company_id = ? ORDER BY name ASC");
        $stmt->execute([$companyId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(string $name, int $companyId): int
    {
        global $pdo;
        $check = $pdo->prepare('SELECT id FROM category WHERE company_id = ? AND LOWER(name) = LOWER(?) LIMIT 1');
        $check->execute([$companyId, $name]);
        if ($check->fetchColumn()) {
            throw new \DomainException('Category already exists');
        }
        $stmt = $pdo->prepare('INSERT INTO category (name, company_id) VALUES (?, ?)');
        $stmt->execute([$name, $companyId]);
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
