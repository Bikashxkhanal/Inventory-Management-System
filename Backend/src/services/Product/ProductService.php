<?php 

    namespace App\Services\Product;
    use App\Models\ProductModel;

    class ProductService{
        private ProductModel $productModel;
        public function __construct(ProductModel $productModel){
            $this->productModel = $productModel;
        }

        public function getSearchedProduct(string $searchedQuery){
            //validate and sanitize 

             $query = strtolower(trim($searchedQuery));

           $result = $this->productModel->getSearchedProduct($searchedQuery);

           return $result;

        }
    }