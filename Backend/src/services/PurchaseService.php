<?php
namespace App\Services;

use App\Domain\Purchase\PurchasePolicy;
use App\Domain\Session\SessionManager;
use App\Models\PurchaseModel;
use App\Models\PurchaseItemsModel;
use App\Models\ProductModel;
use App\Models\StockModel;
use App\Services\SessionService;
use DateTime;
use Exception;
use InvalidArgumentException;

class PurchaseService
{
    private PurchaseModel $purchaseModel;
    private PurchaseItemsModel $purchaseItemModel;
    private ProductModel $productModel;
    private StockModel $stockModel;
    private SessionService $sessionService;
    private PurchasePolicy $purchasePolicy;

    public function __construct(
        PurchaseModel $purchaseModel,
        PurchaseItemsModel $purchaseItemModel,
        ProductModel $productModel
    ) {
        $this->purchaseModel = $purchaseModel;
        $this->purchaseItemModel = $purchaseItemModel;
        $this->productModel = $productModel;
        $this->stockModel = new StockModel();
        $this->sessionService = new SessionService(new SessionManager());
        $this->purchasePolicy = new PurchasePolicy();
    }

    private function currentUser(): array
    {
        $session = $this->sessionService->get('user');
        if (!$session || empty($session['user'])) {
            throw new Exception('Unauthorized');
        }
        return $session['user'];
    }

    private function currentRole(): string
    {
        return strtolower((string) $this->currentUser()['role']);
    }

    public function createPurchaseHeader(int $vendorId, string $purchaseDate): array
    {
        $user = $this->currentUser();
        $this->purchasePolicy->assertCanCreate($this->currentRole());

        $parsed = DateTime::createFromFormat('Y-m-d', $purchaseDate);
        if (!$parsed || $parsed->format('Y-m-d') !== $purchaseDate) {
            throw new InvalidArgumentException('Purchase date must be yyyy-mm-dd');
        }

        $created = $this->purchaseModel->create(
            $vendorId,
            $purchaseDate,
            (int) $user['id']
        );

        return [
            'id' => $created['id'],
            'status' => 'draft',
        ];
    }

    public function addPurchaseItem(int $purchaseId, int $productId, int $quantity, float $price): array
    {
        $this->purchasePolicy->assertCanCreate($this->currentRole());

        $purchase = $this->purchaseModel->findById($purchaseId);
        if (!$purchase) {
            throw new Exception('Purchase not found');
        }
        $status = $purchase['status'] ?? 'draft';
        if ($status === 'completed') {
            throw new Exception('Cannot add items to a completed purchase');
        }
        if ($status === 'rejected') {
            throw new Exception('Cannot add items to a rejected purchase');
        }
        if ($quantity < 1 || $price <= 0) {
            throw new InvalidArgumentException('Invalid quantity or unit price');
        }

        global $pdo;
        try {
            $pdo->beginTransaction();
            $subtotal = $this->purchaseItemModel->addItem($purchaseId, $productId, $quantity, $price);
            $this->purchaseModel->updateTotal($purchaseId, $subtotal);
            $pdo->commit();
            return ['success' => true, 'subtotal' => $subtotal];
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function finalizePurchase(int $purchaseId): array
    {
        $role = $this->currentRole();
        $this->purchasePolicy->assertCanCreate($role);

        $purchase = $this->purchaseModel->findById($purchaseId);
        if (!$purchase) {
            throw new Exception('Purchase not found');
        }
        if ($purchase['status'] === 'completed') {
            throw new Exception('Purchase is already completed');
        }

        $items = $this->purchaseItemModel->getItemsByPurchaseId($purchaseId);
        if (empty($items)) {
            throw new Exception('Add at least one line item before submitting');
        }

        if ($this->purchasePolicy->completesOnFinalize($role)) {
            global $pdo;
            try {
                $pdo->beginTransaction();
                $this->applyStockFromItems($items);
                $this->purchaseModel->setStatus($purchaseId, 'completed');
                $pdo->commit();
                return ['success' => true, 'status' => 'completed'];
            } catch (Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                throw $e;
            }
        }

        return ['success' => true, 'status' => 'draft'];
    }

    public function verifyPurchase(int $purchaseId): array
    {
        $this->purchasePolicy->assertCanVerify($this->currentRole());

        $purchase = $this->purchaseModel->findById($purchaseId);
        if (!$purchase) {
            throw new Exception('Purchase not found');
        }
        if ($purchase['status'] !== 'draft') {
            throw new Exception('Only draft purchases can be verified');
        }

        $items = $this->purchaseItemModel->getItemsByPurchaseId($purchaseId);
        if (empty($items)) {
            throw new Exception('Purchase has no items to verify');
        }

        global $pdo;
        try {
            $pdo->beginTransaction();
            $this->applyStockFromItems($items);
            $this->purchaseModel->setStatus($purchaseId, 'completed');
            $pdo->commit();
            return ['success' => true, 'status' => 'completed'];
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function rejectPurchase(int $purchaseId, ?string $reason = null): array
    {
        $this->purchasePolicy->assertCanVerify($this->currentRole());

        $purchase = $this->purchaseModel->findById($purchaseId);
        if (!$purchase) {
            throw new Exception('Purchase not found');
        }
        if ($purchase['status'] !== 'draft') {
            throw new Exception('Only draft purchases can be rejected');
        }

        global $pdo;
        try {
            $pdo->beginTransaction();

            if (
                \App\Helpers\PurchaseSchema::hasPurchaseColumn('status') &&
                \App\Helpers\PurchaseSchema::supportsRejectedStatus()
            ) {
                $this->purchaseModel->setStatus($purchaseId, 'rejected');
                $pdo->commit();
                return ['success' => true, 'status' => 'rejected', 'reason' => $reason];
            }

            // Fallback when ENUM has no 'rejected': remove draft (same as delete)
            $this->purchaseItemModel->deleteItemsByPurchaseId($purchaseId);
            $this->purchaseModel->deleteById($purchaseId);
            $pdo->commit();
            return [
                'success' => true,
                'status' => 'removed',
                'reason' => $reason,
                'message' => 'Purchase removed. To keep rejected records, run migrations/002_add_rejected_status.sql',
            ];
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function updatePurchase(int $id, int $vendorId, string $purchaseDate): array
    {
        $this->purchasePolicy->assertCanUpdate($this->currentRole());

        $purchase = $this->purchaseModel->findById($id);
        if (!$purchase) {
            throw new Exception('Purchase not found');
        }
        $status = $purchase['status'] ?? 'draft';
        if ($status !== 'draft') {
            throw new Exception('Only draft purchases can be updated');
        }

        $parsed = DateTime::createFromFormat('Y-m-d', $purchaseDate);
        if (!$parsed || $parsed->format('Y-m-d') !== $purchaseDate) {
            throw new InvalidArgumentException('Purchase date must be yyyy-mm-dd');
        }

        $this->purchaseModel->updateHeader($id, $vendorId, $purchaseDate);
        return ['success' => true];
    }

    public function deletePurchase(int $id): array
    {
        $this->purchasePolicy->assertCanDelete($this->currentRole());

        $purchase = $this->purchaseModel->findById($id);
        if (!$purchase) {
            throw new Exception('Purchase not found');
        }
        if ($purchase['status'] !== 'draft') {
            throw new Exception('Only draft purchases can be deleted');
        }

        global $pdo;
        try {
            $pdo->beginTransaction();
            $this->purchaseItemModel->deleteItemsByPurchaseId($id);
            $this->purchaseModel->deleteById($id);
            $pdo->commit();
            return ['success' => true];
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function fetchPaginated(int $page, int $limit, ?string $statusFilter = null): array
    {
        return $this->purchaseModel->fetchPaginated($page, $limit, $statusFilter);
    }

    public function fetchPurchasesDetailsList(int $page, int $limit, array $filters = []): array
    {
        return $this->purchaseModel->fetchPurchasesDetailsList($page, $limit, $filters);
    }

    public function getPurchaseById(int $id): array
    {
        $purchase = $this->purchaseModel->findById($id);
        if (!$purchase) {
            throw new Exception('Purchase not found');
        }
        return $purchase;
    }

    public function fetchStats(): array
    {
        return $this->purchaseModel->fetchStats();
    }

    public function getTotalPurchaseAmountByDateRange(array $requestedData)
    {
        if (empty($requestedData['startDate']) || empty($requestedData['endDate'])) {
            throw new InvalidArgumentException('Start Date and End Date are required.');
        }

        $startDate = $requestedData['startDate'];
        $endDate = $requestedData['endDate'];
        $dateFormat = 'Y-m-d';
        $parsedStart = DateTime::createFromFormat($dateFormat, $startDate);
        $parsedEnd = DateTime::createFromFormat($dateFormat, $endDate);

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

    public function getPurchaseAmountOfDateRange(array $requestedData): array
    {
        if (empty($requestedData['startDate']) || empty($requestedData['endDate'])) {
            throw new InvalidArgumentException('Start Date and End Date are required.');
        }

        $startDate = $requestedData['startDate'];
        $endDate = $requestedData['endDate'];
        $dateFormat = 'Y-m-d';
        $parsedStart = DateTime::createFromFormat($dateFormat, $startDate);
        $parsedEnd = DateTime::createFromFormat($dateFormat, $endDate);

        if (!$parsedStart || $parsedStart->format($dateFormat) !== $startDate) {
            throw new InvalidArgumentException('Start Date must be in yyyy-mm-dd format.');
        }
        if (!$parsedEnd || $parsedEnd->format($dateFormat) !== $endDate) {
            throw new InvalidArgumentException('End Date must be in yyyy-mm-dd format.');
        }
        if ($parsedStart > $parsedEnd) {
            throw new InvalidArgumentException('Start Date must not be after endDate.');
        }

        return $this->purchaseModel->getPurchaseAmountOfDateRange($startDate, $endDate);
    }

    private function applyStockFromItems(array $items): void
    {
        $stockRows = [];
        foreach ($items as $item) {
            $stockRows[] = [
                'productId' => (int) $item['product_id'],
                'quantity' => (int) $item['quantity'],
            ];
        }
        $this->stockModel->increaseStock($stockRows);
    }
}
