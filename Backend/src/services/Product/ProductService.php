<?php 

    namespace App\Services\Product;
    use App\Models\ProductModel;
    use App\Models\StockModel;
    use PDO;

    class ProductService{
        private ProductModel $productModel;
        private StockModel $stockModel;
        public function __construct(ProductModel $productModel, StockModel $stockModel){
            $this->productModel = $productModel;
            $this->stockModel= $stockModel;
        }

        public function getSearchedProduct(string $searchedQuery){
            //validate and sanitize 

             $query = strtolower(trim($searchedQuery));

           $result = $this->productModel->getSearchedProduct($searchedQuery);

           return $result;

        }

        public function getAProductDetail(int $productId){
            global $pdo;

            try { 
                //for two db calls
                $pdo->beginTransaction();
                
                //first get product name , 
            //    $name =  $this->productModel->getProductName($productId);
                //get product quantity
               $stock = $this->stockModel->getStockQuantityByProduct($productId);
                    //get product selling price 
               $sellingPrice = $this->stockModel->getStockSellingPriceByProduct($productId);

               $pdo->commit();
             return [ 'stock' => $stock, 'sellingPrice' => $sellingPrice];


            } catch (Exception $e) {
                $pdo->rollback();
                throw new Exception("Failed on fetching product detail");
            }
        }
    }