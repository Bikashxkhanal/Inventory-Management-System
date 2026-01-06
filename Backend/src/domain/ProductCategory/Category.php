<?php   
    namespace App\Domain\Category;

    use Predis\Command\Container\Search\FTCURSOR;
    class Category{
        private int $categoryId;
        private string $categoryName;
        private string $status;
        public function __construct(){}
        public function getCategoryId(){return $this->categoryId;}
        public function getCategoryName(){return $this->categoryName;}
        public function getStatus(){return $this->status;}
        

       
    }