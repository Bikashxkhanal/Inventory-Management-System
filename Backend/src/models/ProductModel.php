<?php 
namespace App\Models;


use DomainException;
use Exception;
use RuntimeException;
use PDO;

class ProductModel {


    public function fetchAll() {
         global $pdo;
        $stmt = $pdo->query("SELECT id, name FROM product");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function fetchByCategory(int $categoryId): array
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT id, name FROM product WHERE category_id = :category_id");
    $stmt->execute(['category_id' => $categoryId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public function updateStock($productId, $quantity) {
         global $pdo;
        $stmt = $pdo->prepare("UPDATE product SET stock = stock + ? WHERE id = ?");
        $stmt->execute([$quantity, $productId]);
    }


    public function getProductName(int $productId){
        global $pdo;
        
        $stmt = $pdo->prepare("SELECT name FROM product WHERE id = ?");
        $stmt->execute([$productId]);

       $result =  $stmt->fetch(PDO::FETCH_ASSOC);
       if(!$result){
            throw new Exception("Product id doesnot exist");
       }
       
       return $result ;
    }


    public function getSearchedProduct(string $searchQuery){
        global $pdo; 

         $stmt =  $pdo->prepare("
                SELECT 
                id AS id,
                name AS name
                FROM product WHERE name LIKE CONCAT('%', ? , '%')
        ");

        $stmt->execute([$searchQuery]);

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
}
