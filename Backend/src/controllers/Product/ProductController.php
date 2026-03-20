<?php 

    namespace App\Controllers\Product;
    use Exception;
    use App\Services\Product\ProductService;
    use App\Models\ProductModel;
    use App\Models\StockModel;


    class ProductController {

        private ProductService $productService;

        public function __construct(){ 
         $this->productService =   new ProductService(new ProductModel, new StockModel);
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

        public function getAProductDetail(){
            try {

            if(!isset($_GET['id'])){
                throw new Exception("Product id is required");
            }

            $productId = (int) $_GET['id'];

            $result = $this->productService->getAProductDetail($productId);

            http_response_code(200);
            echo json_encode([
                'success' => true, 
                'message' => 'Product details fetched successfully!', 
                'data' => is_array($result) ? $result : [$result]
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