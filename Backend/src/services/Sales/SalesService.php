<?php

namespace App\Services\Sales;


use PDO;
use DateTime;
use Exception;
use InvalidArgumentException; 
use App\Models\SalesModel;
use App\Models\SalesItemsModel;
use App\Models\CustomerModel;
use App\Models\StockModel;
use App\Models\ProductModel;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;


class SalesService {
    private SalesModel $salesModel;
    private SalesItemsModel $salesItemsModel;
    private CustomerModel $customerModel;
    private StockModel $stockModel;
    private ProductModel $productModel;

    public function __construct(
        SalesModel $salesModel,
        SalesItemsModel $salesItemsModel,
        CustomerModel $customerModel, 
        StockModel $stockModel,
        ProductModel $productModel
        
    ) {
        
        $this->salesModel = $salesModel;
        $this->salesItemsModel = $salesItemsModel;
        $this->customerModel = $customerModel;
        $this->stockModel= $stockModel;
        $this->productModel= $productModel;
        
    }

    private function currentUser(): array
    {
        $sessionService = new SessionService(new SessionManager());
        $session = $sessionService->get('user');
        if (!$session || empty($session['user'])) {
            throw new Exception('Unauthorized');
        }
       return $session;
    }


public function getPaginatedSales(int $page, int $limit): array {
    $user = $this->currentUser();
        return $this->salesModel->fetchPaginated($user['company']['companyId'], $page, $limit);
    }

    public function getSalesDetailsList(int $page, int $limit, array $filters = []): array
    {
        $user = $this->currentUser();
        return $this->salesModel->fetchSalesDetailsList($user['company']['companyId'],$page, $limit, $filters);
    }

    
public function createSale(array $data): array {
        //$data should have $data['customer']['...'], $data['sales'][...], $data['salesItems'][[], [], ...]
        //TODO: to create sale , first check where customer of given phone number exist or not(if provided)
        // if phone number is not provdied no need to check , 
        // if customer exist returns it ID, if not insert and returns it id
        // add sale (use customer id here if available) to sales DB, and returns it's ID
        //add salesItems (use sales ID), if transcation complete commit , if not rollback
        global $pdo;

        try{
            //starting trancation 
            $pdo->beginTransaction(); 

            //get product Id by productName for all 
            foreach($data['salesItems'] as &$eachSaleItems){

            $result =  $this->productModel->findProductIdByName($eachSaleItems['product']); 

                if($result == null){
                    throw new Exception("Add the items that in the stock" . $result);
                }

                $eachSaleItems['productId']  = $result;
            }

            unset($eachSaleItems);

                  

            //check stock quantity , TODO: must be shift to model not a policy
            foreach($data['salesItems'] as $saleItems){
             $isEnough =   $this->stockModel->hasEnoughStock($saleItems['productId'], $saleItems['quantity']);
             if($isEnough == false){
                throw new Exception("Availabe quantity is less" );
             }

            }
            
            $customer = null;
            //if phone number is provided then
            if(!empty($data['customer']['phoneNumber'])){
                //returns customer
                $customer =  $this->customerModel->findByPhoneNumber($data['customer']['phoneNumber']);
                if($customer === false){
                //if customer is not in db , add 
                 $customer = $this->customerModel->create((string) $data['customer']['phoneNumber']);
                }
            }

             //assuming no customer id is provided
            $customerId = null;

            $data['sales']['customerId'] = isset($customer['id']) ? $customer['id'] : $customerId;

            $user = $this->currentUser();

            //after inserting sells, it returns success and id.
            $sale =  $this->salesModel->insertSale($data['sales'], $user['company']['companyId']);
            if(($sale['success']) != true){
                 new Exception("Sales couldnot be created");
             }

        //after inserting sells , insert sellsItems, each sellItem contains: sale_id, product_id, quantity, price , subtotal (item_subtotal) TODO: CREATE class of sells and sells, items in future

        //adding sellID to each data
        foreach($data['salesItems'] as &$eachData) {
                $eachData['saleId'] = $sale['id'];
        }
        unset($eachData);

        //adding sells items in the db
        $salesItemInsertStatus =  $this->salesItemsModel->addSalesItems($data['salesItems']);

        //reduce stock of the products 
        $stocksDatas = [];
        foreach($data['salesItems'] as &$eachData){
            $stockDatas['productId'] = $eachData['productId'];
            $stockDatas['quantity'] = $eachData['quantity'];
            array_push($stocksDatas, $stockDatas);
        }
        //even this is under policy must be done from model
       $this->stockModel->reduceStock($stocksDatas);

        //commiting to the db
        $pdo->commit();

        return ['success' => true ];
  
        }catch(Throwable $th){
        //rollbacking if any of the transcation failes
        $pdo->rollback();
        throw $th;
        }
        
    }




// public function updateSale(array $data): array {
//     return $this->salesModel->updateSaleDetails($data);
// }



public function getTotalSalesAmountByDateRange(array $requestedData) {
    // Validate required fields
    if (empty($requestedData['startDate']) || empty($requestedData['endDate'])) {
        throw new InvalidArgumentException('startDate and endDate are required.');
    }

    $startDate = $requestedData['startDate'];
    $endDate = $requestedData['endDate'];
    // Sanitize
    // $startDate = filter_var(trim($requestedData['startDate']), FILTER_SANITIZE_STRING);
    // $endDate   = filter_var(trim($requestedData['endDate']), FILTER_SANITIZE_STRING);

    // Validate format (yyyy-mm-dd)
    $dateFormat  = 'Y-m-d';
    $parsedStart = DateTime::createFromFormat($dateFormat, $startDate);
    $parsedEnd   = DateTime::createFromFormat($dateFormat, $endDate);

    if (!$parsedStart || $parsedStart->format($dateFormat) !== $startDate) {
        throw new InvalidArgumentException('startDate must be in yyyy-mm-dd format.');
    }
    if (!$parsedEnd || $parsedEnd->format($dateFormat) !== $endDate) {
        throw new InvalidArgumentException('endDate must be in yyyy-mm-dd format.');
    }

    if ($parsedStart > $parsedEnd) {
        throw new InvalidArgumentException('startDate must not be after endDate.');
    }

    $user = $this->currentUser();

    $result = $this->salesItemsModel->getTotalSalesAmountByDateRange($user['company']['companyId'], $startDate, $endDate);

    return $result;
}


public function getSalesCountByDateRange(array $requestedData) {
    // Validate required fields exist
    if (empty($requestedData['startDate']) || empty($requestedData['endDate'])) {
        throw new InvalidArgumentException('startDate and endDate are required.');
    }

    $startDate = trim($requestedData['startDate']);
    $endDate = trim($requestedData['endDate']);
    // // Sanitizthing the dates
    // $startDate = filter_var(trim($requestedData['startDate']), FILTER_SANITIZE_STRING);
    // $endDate   = filter_var(trim($requestedData['endDate']), FILTER_SANITIZE_STRING);

    // Validating date format (yyyy-mm-dd)
    $dateFormat = 'Y-m-d';
    $parsedStart = DateTime::createFromFormat($dateFormat, $startDate);
    $parsedEnd   = DateTime::createFromFormat($dateFormat, $endDate);

    //check format
    if (!$parsedStart || $parsedStart->format($dateFormat) !== $startDate) {
        throw new InvalidArgumentException('startDate must be in yyyy-mm-dd format.');
    }
    if (!$parsedEnd || $parsedEnd->format($dateFormat) !== $endDate) {
        throw new InvalidArgumentException('endDate must be in yyyy-mm-dd format.');
    }

    // ensuring startdate is not over the end date
    if ($parsedStart > $parsedEnd) {
        throw new InvalidArgumentException('startDate must be before endDate.');
    }


    return $this->salesModel->getSalesCountByDate($startDate, $endDate);
}


public function getSalesAmountOfDateRange(array $requestedData){

    // Validate required fields exist
    if (empty($requestedData['startDate']) || empty($requestedData['endDate'])) {
        throw new InvalidArgumentException('startDate and endDate are required.');
    }

    //sanitizing
    $startDate = trim($requestedData['startDate']);
    $endDate = trim($requestedData['endDate']);

    // Validating date format (yyyy-mm-dd)
    $dateFormat = 'Y-m-d';
    $parsedStart = DateTime::createFromFormat($dateFormat, $startDate);
    $parsedEnd   = DateTime::createFromFormat($dateFormat, $endDate);

    //checking date format
    if (!$parsedStart || $parsedStart->format($dateFormat) !== $startDate) {
        throw new InvalidArgumentException('Start Date must be in yyyy-mm-dd format.');
    }
    if (!$parsedEnd || $parsedEnd->format($dateFormat) !== $endDate) {
        throw new InvalidArgumentException('End Date must be in yyyy-mm-dd format.');
    }

    // ensuring startdate is not over the end date
    if ($parsedStart > $parsedEnd) {
        throw new InvalidArgumentException('Start Date must be before End Date.');
    }

    $user  = $this->currentUser();
    //calling sales model and returning data 
    $result =  $this->salesItemsModel->getSalesAmountOfDateRange($user['company']['companyId'], $startDate, $endDate);

    if($result === null){
    throw new Exception("Failed to get sales data");
    }

    return $result;
 }

}
