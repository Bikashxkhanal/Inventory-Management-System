<?php

namespace App\Services\Sales;

use App\Models\SalesModel;

class SalesService {
    private SalesModel $salesModel;

    public function __construct() {
        $this->salesModel = new SalesModel();
    }

    public function getPaginatedSales(int $page, int $limit): array {
        return $this->salesModel->fetchPaginated($page, $limit);
    }

    public function createSale(array $data): array {
        return $this->salesModel->insertSale($data);
    }

    public function updateSale(array $data): array {
        return $this->salesModel->updateSaleDetails($data);
    }
}
