<?php 
    namespace App\Domain\Products;

    class Product{
        private int $id;
        private string $name;
        private Category $category;
        private string $status;

        public function __construct(int $id, string $name , category $category, string $status){
            $this->id = $id;
            $this->name = $name;
            $this->category = $category;
            $this->status =$status;
        }


        public function changeName(string $name){$this->name = $name;}
        public function changeToAvailable(){
            $this->status = 'available';
        }

        public function changeToUnavailable(){
            $this->status = 'unavailable';
        }

        public function getId(){return $this->id;}
        public function getName(){return $this->name;}
        public function getCategory(){return $this->category;}
        public function getStatus(){
            return $this->status;
        }

        public function getProductDetails(){
            return [
                'id' => $this->id,
                'name' => $this->name,
                'category'=> $this->category,
                'status' => $this->status
            ];
        }

    }
