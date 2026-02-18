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
}
