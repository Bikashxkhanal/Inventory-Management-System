<?php 
namespace App\Models;

use App\Domain\Products\Product;
use DomainException;
use Exception;

class ProductModel{
    public function getById(int $id): Product{
        global $pdo;
     $stmt=$pdo->prepare("SELECT * FROM product WHERE product_id = ?");
     $stmt->execute([$id]);
   $product=  $stmt->fetch(\PDO::FETCH_ASSOC);
   return new Product($product['product_id'], $product['product_name'], $product['product_category'], $product['product_status']);

    }
    public function addProduct(Product $product){
        global $pdo;
       $stmt= $pdo->prepare("INSERT INTO product (product_name, product_category, product_status) VALUES (?, ?, ?)");
       $stmt->execute([ $product->getName(), $product->getCategory(), $product->getStatus()]);

    }
    public function updateProduct(Product $product ){
        global $pdo;
        $params = [];
        $fields = [];
        if($product->getName()){
            $params[] = $product->getName();
            $fields[] = "product_name = ?";
        }
         if($product->getCategory()){
            $params[] = $product->getCategory();
            $fields[] = "product_category = ?";
        }
         if($product->getStatus()){
            $params[] = $product->getStatus();
            $fields[] = "product_status = ?";
        }
        $params[] = $product->getId();

       $stmt= $pdo->prepare("UPDATE product SET" . 
        implode(', ' , $fields). 
        "WHERE product_id = ?");
        $stmt->execute($params);

    }
    public function deleteProduct(int $id){
        global $pdo;
        $pdo->beginTransaction();
       $stmt = $pdo->prepare("DELETE FROM product WHERE product_id = ?");
     $stmt->execute([$id]);
    if($stmt->rowCount() === 0){
        $pdo->rollBack();
        throw new DomainException('product not found');
    }
    $pdo->commit(); 
    }
}