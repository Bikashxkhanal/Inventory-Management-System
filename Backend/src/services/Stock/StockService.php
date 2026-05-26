<?php 
namespace App\Services\Stock;

use App\Models\StockModel;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;

class StockService {

    private StockModel $stockModel;

    public function __construct() {
       $this->stockModel = new StockModel();
    }

    private function currentUser(): array
    {
        $session = new SessionService(new SessionManager());
        $user = $session->get('user');
        if (!$user) {
            throw new Exception('Unauthorized');
        }
        return $user;
    }

    public function getPaginatedStocks(int $page, int $limit, ?string $search = null): array {
       
        $offset = ($page - 1) * $limit;

        $user = $this->currentUser();
        $stocks = $this->stockModel->fetchStocks($offset, $limit,$user['company']['companyId'], $search);
        $totalRecords = $search
            ? $this->stockModel->countStocksFiltered( $user['company']['companyId'], $search)
            : $this->stockModel->countStocks($user['company']['companyId']);

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
    $user = $this->currentUser();
    $stats = $this->stockModel->countStockStatuses($user['company']['companyId']);

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

