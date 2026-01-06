<?php   
    namespace App\Models;

    use App\Domain\Category\Category;
    use DomainException;
    use RuntimeException;
    class CategoryModel{
        public function create(array $categoryDetails){
             
                global $pdo;
               $stmt = $pdo->prepare("INSERT INTO category () VALUES ()");
               if(!$stmt->execute([])){
                throw new RuntimeException('failed to create category');
               }
             return $pdo->lastInsertId();

            

        }
        public function findOneById(int $id){
            global $pdo;
          $stmt =  $pdo->prepare("SELECT * FROM category WHERE category_id = :id AND category_status = :cat_status");
          if($stmt->execute(['id' => $id, 'cat_status' => 'active'])){
            throw new RuntimeException('failed to get category');
          };

          return $stmt->fetch(\PDO::FETCH_ASSOC);

        }
        public function findOneByName(string $name, string $status){
            global $pdo;
           $stmt = $pdo->prepare("SELECT * FROM product WHERE product_name = :product_name AND category_status = :cat_status");
           if($stmt->execute([$name, $status])){
            throw new RuntimeException('faild to get category');
           }

           return $stmt->fetch(\PDO::FETCH_ASSOC);

        }

        //fetch all category data
        public function findAll(){
          global $pdo;
           $categories = [];
          $stmt = $pdo->prepare("SELECT * FROM category");
          $stmt->execute();
        while ($category = $stmt->fetchObject(Category::class)){
          $categories[] = $category;
        }

        }
    }