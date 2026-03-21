<?php

namespace App\Controllers\Sales;

//this controller is for both sales and salesItems
use App\Services\Sales\SalesService;
use Exception;
use App\Models\SalesModel;
use App\Models\SalesItemsModel;
use App\Models\CustomerModel;
use App\Models\StockModel;
use App\Models\ProductModel;

class SalesController {
    private SalesService $salesService;
    private SalesItemsService $salesItemsService;

    public function __construct() {
        $this->salesService = new SalesService(new SalesModel(), new SalesItemsModel(), new CustomerModel(), new StockModel(), new ProductModel());
  
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
      try {
      $result = $this->salesService->createSale($requestData);
      http_response_code(200);
      echo json_encode([
        'success' => true,
        'message' => 'Sales added successfully!', 
        'data' => [],
      ]);
       
      } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
        'success' => false,
        'message' => $e->getMessage(), 
        'data' => [$requestData]
      ]);
      }
      
    }

    // Update sale (Store Manager)
    public function updateSale($requestData) {
        $result = $this->salesService->updateSale($requestData);
        echo json_encode($result);
    }

    //get sales information(amount) by date range
    public function getTotalSalesAmountByDateRange(){
        try{
           if(!isset($_GET['startDate'])){
            throw new Exception("Start Date is required");
        } 
        $requestData['startDate']  =   (string)$_GET['startDate'] ;
        

        if(!isset($_GET['endDate'])){
            throw new Exception("End Date is required");
        } 
        $requestData['endDate']  =  (string)$_GET['endDate'] ;

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
        try{
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

    // return the sales amount of of each date of the requested date range including both start and end date
    public function getSalesAmountOfDateRange($requestData){
      try {
         if(!isset($_GET['startDate'])){
            throw new Exception("Start Date is required");
        } 
        $requestData['startDate']  =  (string)$_GET['startDate'] ;
        

        if(!isset($_GET['endDate'])){
            throw new Exception("End Date is required");
        } 
        $requestData['endDate']  =  (string)$_GET['endDate'] ;
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
          'message' => $e->getMessage(), 
          'data' => []
        ]);
        
      }
         

    }
    
}
