<?php

namespace App\Controllers\Sales;

use App\Services\Sales\SalesService;
use Exception;

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

    //get sales information(amount) by date range
    public function getTotalSalesAmountByDateRange($requestData){
        try{
      $result =   $this->salesService->getTotalSalesAmountByDateRange($requestData);
      http_response_code(200);
      echo json_encode([
        'success' => true,
        'message' => 'Sales Amount fetched successfully!', 
        'data' => [
            'totalSalesAmount' => $result
        ]
      ]);

      }catch(Exception $e){
    http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => $e->getMessage(), 
        'data' => []
      ]);
        }
    }

    //get all the sells count (numer of sells done) from date range selected
    public function getSalesCountByDateRange($requestData){
        try {
        $result = $this->salesService->getSalesCountByDateRange($requestData);
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Sells count fetched successfully!', 
            'data' => ['totalSales' =>  $result]
        ]);

    } catch (Exception $e) {
    http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => $e->getMessage(), 
        'data' => [
             
        ]
      ]);
    }
    }


    public function getSalesAmountOfDateRange($requestData){
      try {
      $result = $this->salesService->getSalesAmountOfDateRange($requestData);

      http_response_code(200);
      echo json_encode([
        'success' => true,
        'message' => 'Sales Amount of date range fetched successfully!',
        'data' => $result
      ]);

      } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
          'success' => true, 
          'message' => $e.getMessage(), 
          data => []
        ]);
        
      }
         

    }
    
}
