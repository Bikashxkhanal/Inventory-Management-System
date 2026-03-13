<?php

namespace App\Services\Sales;

use App\Models\SalesModel;
use DateTime;
use Exception;
use InvalidArgumentException;

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

    $result = $this->salesModel->getTotalSalesAmountByDateRange($startDate, $endDate);

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

//
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

    //calling sales model and returning data 
    $result =  $this->salesModel->getSalesAmountOfDateRange($startDate, $endDate);

  if($result === null){
    throw new Exception("Failed to get sales data");
  }

  return $result;


}






}
