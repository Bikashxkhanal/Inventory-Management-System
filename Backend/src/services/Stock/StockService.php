<?php 
namespace App\Services\Stock;

use App\Models\StockModel;

class StockService {

    private StockModel $stockModel;

    public function __construct() {
       $this->stockModel = new StockModel();
    }

    public function getPaginatedStocks(int $page, int $limit): array {
       
        $offset = ($page - 1) * $limit;
        
        $stocks = $this->stockModel->fetchStocks($offset, $limit);
        $totalRecords = $this->stockModel->countStocks();

        $totalPages = ceil($totalRecords / $limit);

        return [
            'data' => $stocks,
            'meta' => [
                'currentPage' => $page,
            'totalPages' => $totalPages,
            'totalRecords' => $totalRecords
            ]
            
        ];
    }


    public function getStockStats(): array
{
    $stats = $this->stockModel->countStockStatuses();

    $total = $stats['total'] ?? 0;

    return [
        'total' => (int)$total,
        'inStock' => (int)($stats['inStock'] ?? 0),
        'outOfStock' => (int)($stats['outOfStock'] ?? 0),
        'highStock' => (int)($stats['highStock'] ?? 0),
    ];
}

public function getStockQuantityAndUnitPriceOfAProduct(int $productId){

     //sanitize\validate the input 
    $productId = filter_var(trim($productId), FILTER_VALIDATE_INT);

    if($productId == false){
        throw new Exception("Enter valid productId");
    }

    //db calls
   $stockQty =  $this->stockModel->getStockQuantityByProduct($productId);
   $stockSellingPrice = $this->stockModel->getStockSellingPriceByProduct($productId);

   return ['quantity' => $stockQty , 'sellingPrice' => $stockSellingPrice];

}

}

