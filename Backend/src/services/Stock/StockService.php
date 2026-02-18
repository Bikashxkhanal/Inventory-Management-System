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

}

