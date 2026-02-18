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

        $result = $this->stockService->getPaginatedStocks($page, $limit);

        echo json_encode($result);
    }

    public function fetchStockStats($requestData)
{
    $result = $this->stockService->getStockStats();
    echo json_encode($result);
}

}
