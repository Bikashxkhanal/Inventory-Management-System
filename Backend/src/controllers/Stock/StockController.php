<?php 
namespace App\Controllers\Stock;

use App\Services\Stock\StockService;


class StockController {

    private StockService $stockService;

    public function __construct( ) {
        $this->stockService = $stockService = new StockService();
    }



    public function fetchStocks($requestData) {

        $page  = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;

    if ($limit <= 0) {
        $limit = 10;
    }

    if ($page <= 0) {
        $page = 1;
    }

        $search = isset($_GET['search']) ? trim((string) $_GET['search']) : null;
        $result = $this->stockService->getPaginatedStocks($page, $limit, $search);

        echo json_encode($result);
    }

public function fetchStockStats($requestData)
{
  
    $result = $this->stockService->getStockStats();
    echo json_encode($result);
}

public function getStockQuantityAndUnitPriceOfAProduct(){
            try {
                if(!isset($_GET['productId'])){
                    throw new Exception("Product Id is required");
                }

                $productId = (int) $_GET['productId'];
                //call service method
                $this->stockService->getStockQuantityAndUnitPriceOfAProduct($productId);
            } catch (Exception $e) {
                //throw $th;
            }
}

}
