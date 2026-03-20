<?php 

    namespace App\Controllers\Product;
    use Exception;
    use App\Services\Product\ProductService;
    use App\Models\ProductModel;

    class ProductController {

        private ProductService $productService;

        public function __construct(){ 
         $this->productService =   new ProductService(new ProductModel);
        }

        public function getSearchedProduct(){
            //get the params from get request 

            try {
            if(!isset($_GET['query'])){
                    throw new Exception("please search something ");
            }

            $queryString = (string) $_GET['query'];

            //calling service layer of product

            $result = $this->productService->getSearchedProduct($queryString);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Successfully fetched searched Products', 
                'data' => is_array($result) ? $result : [$result],
            ]);

             } catch (Exception $e) {
                http_response_code(300);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'data' => []
                ]);
            }
            
        }
    }