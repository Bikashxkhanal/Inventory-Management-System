<?php

namespace App\Controllers\Sales;

use App\Services\Sales\SalesService;

class SalesController {
    private SalesService $salesService;

    public function __construct() {
        $this->salesService = new SalesService();
    }

    // Fetch paginated sales
    public function fetchSales($requestData) {
        $page = (int)($requestData['page'] ?? 1);
        $limit = (int)($requestData['limit'] ?? 10);

        $sales = $this->salesService->getPaginatedSales($page, $limit);
        echo json_encode($sales);
    }

    // Create sale (Salesperson)
    public function createSale($requestData) {
        $result = $this->salesService->createSale($requestData);
        echo json_encode($result);
    }

    // Update sale (Store Manager)
    public function updateSale($requestData) {
        $result = $this->salesService->updateSale($requestData);
        echo json_encode($result);
    }
}
