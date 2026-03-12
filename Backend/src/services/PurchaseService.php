<?php
    namespace App\Services;
     use App\Infrastructures\Sanitization\CreateBusinessAccountSanitization;
    use App\Infrastructures\Sanitization\LoginSanitization;
    use App\Infrastructures\Sanitization\SuperAdminSignupSanitization;
    use App\Domain\Session\SessionManager;
    use App\Models\CompanyModel;
    use App\Services\SanitizationService;
    use App\Services\ValidationService;
    use App\Models\UserModel;
     use App\Models\PurchaseModel;
    use App\Services\NotificationService;
    use App\Services\OtpService;
    use App\Config\RedisConfig;
    use App\Infrastructures\Cache\RedisOtpStore;
    use App\Domain\Mail\OtpMail;
    use App\Infrastructures\Cache\TempUserInfo;
    use DomainException;
    use Exception;
    use InvalidArgumentException;
    use App\Services\SessionService;
    use App\Infrastructures\Validation\loginValidation;
    use App\Infrastructures\Validation\SuperAdminSignupValidation;
    use App\Infrastructures\Validation\BusinessAccountCreationValidation;
    use PDO;
    use DateTime;
class PurchaseService {
    private $purchaseModel;
    private $purchaseItemModel;
    private $productModel;

    public function __construct($purchaseModel, $purchaseItemModel, $productModel) {
        $this->purchaseModel = $purchaseModel;
        $this->purchaseItemModel = $purchaseItemModel;
        $this->productModel = $productModel;
    }

    // Create purchase and return ID
    public function createPurchase($vendor_id, $purchase_date, $totalAmount) {
        return $this->purchaseModel->create($vendor_id, $purchase_date,$totalAmount );
    }

    // Add purchase items + update stock + update total
    public function addPurchaseItem($purchase_id, $product_id, $quantity, $price) {
        global $pdo;
        try {
            $pdo->beginTransaction();

            $subtotal = $this->purchaseItemModel->addItem($purchase_id, $product_id, $quantity, $price);

            $this->productModel->updateStock($product_id, $quantity);

            $this->purchaseModel->updateTotal($purchase_id, $subtotal);

            $pdo->commit();
            return ['success' => true];
        } catch (Exception $e) {
            $this->purchaseItemModel->pdo->rollBack();
            throw $e;
        }
    }

    public function fetchPaginated($page, $limit) {
        return $this->purchaseModel->fetchPaginated($page, $limit);
    }

    public function fetchStats() {
        return $this->purchaseModel->fetchStats();
    }

    public function getTotalPurchaseAmountByDateRange($requestedData){
        // Validate required fields
    if (empty($requestedData['startDate']) || empty($requestedData['endDate'])) {
        throw new InvalidArgumentException('Start Date and End Date are required.' );
    }

    $startDate = $requestedData['startDate'];
    $endDate = $requestedData['endDate'];
    
    // Validate format (yyyy-mm-dd)
    $dateFormat  = 'Y-m-d';
    $parsedStart = DateTime::createFromFormat($dateFormat, $startDate);
    $parsedEnd   = DateTime::createFromFormat($dateFormat, $endDate);

    if (!$parsedStart || $parsedStart->format($dateFormat) !== $startDate) {
        throw new InvalidArgumentException('Start Date must be in yyyy-mm-dd format.');
    }
    if (!$parsedEnd || $parsedEnd->format($dateFormat) !== $endDate) {
        throw new InvalidArgumentException('End Date must be in yyyy-mm-dd format.');
    }

    if ($parsedStart > $parsedEnd) {
        throw new InvalidArgumentException('Start Date must not be after endDate.');
    }

   return $this->purchaseModel->getTotalPurchaseAmountByDateRange($startDate, $endDate);
    }


    public function getPurchaseAmountOfDateRange(array $requestedData){
        //validating
    if (empty($requestedData['startDate']) || empty($requestedData['endDate'])) {
        throw new InvalidArgumentException('Start Date and End Date are required.' );
    }

    //sanitizing
    $startDate = $requestedData['startDate'];
    $endDate = $requestedData['endDate'];
    
    // Validate format (yyyy-mm-dd)
    $dateFormat  = 'Y-m-d';
    $parsedStart = DateTime::createFromFormat($dateFormat, $startDate);
    $parsedEnd   = DateTime::createFromFormat($dateFormat, $endDate);

    //checking the date format
    if (!$parsedStart || $parsedStart->format($dateFormat) !== $startDate) {
        throw new InvalidArgumentException('Start Date must be in yyyy-mm-dd format.');
    }
    if (!$parsedEnd || $parsedEnd->format($dateFormat) !== $endDate) {
        throw new InvalidArgumentException('End Date must be in yyyy-mm-dd format.');
    }
    //checking if the start date is upper then end date
    if ($parsedStart > $parsedEnd) {
        throw new InvalidArgumentException('Start Date must not be after endDate.');
    }

    //calling db 
    return $this->purchaseModel->getPurchaseAmountOfDateRange($startDate, $endDate);

    }
}
