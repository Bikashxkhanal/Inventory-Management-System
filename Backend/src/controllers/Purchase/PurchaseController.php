<?php
namespace App\Controllers\Purchase;

use App\Models\PurchaseModel;
use App\Models\PurchaseItemsModel;
use App\Models\ProductModel;
use App\Models\CategoryModel;
use App\Services\PurchaseService;
use Exception;
use InvalidArgumentException;

class PurchaseController
{
    private PurchaseService $purchaseService;
    private ProductModel $productModel;
    private CategoryModel $categoryModel;

    public function __construct()
    {
        $purchaseModel = new PurchaseModel();
        $purchaseItemModel = new PurchaseItemsModel();
        $this->productModel = new ProductModel();
        $this->categoryModel = new CategoryModel();
        $this->purchaseService = new PurchaseService($purchaseModel, $purchaseItemModel, $this->productModel);
    }

    public function createPurchase($requestData)
    {
        try {
            if (empty($requestData['vendor']) || empty($requestData['date'])) {
                throw new InvalidArgumentException('Vendor and date are required');
            }

            $result = $this->purchaseService->createPurchaseHeader(
                (int) $requestData['vendor'],
                (string) $requestData['date']
            );

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'data' => $result,
            ]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            http_response_code($e->getMessage() === 'Unauthorized' ? 401 : 403);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function fetchPurchase($requestData)
    {
        try {
            $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
            $status = isset($_GET['status']) ? (string) $_GET['status'] : null;

            if ($page < 1 || $limit < 1) {
                throw new Exception('Invalid pagination parameters');
            }

            $result = $this->purchaseService->fetchPaginated($page, $limit, $status);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result['data'],
                'meta' => $result['meta'],
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function fetchPurchaseStats()
    {
        try {
            $stats = $this->purchaseService->fetchStats();
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $stats]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function fetchPurchasesDetailsList($requestData)
    {
        try {
            $page = max(1, (int) ($_GET['page'] ?? 1));
            $limit = max(1, min(50, (int) ($_GET['limit'] ?? 10)));
            $filters = [
                'vendor_id' => !empty($_GET['vendor_id']) ? (int) $_GET['vendor_id'] : null,
                'date_from' => $_GET['date_from'] ?? null,
                'date_to' => $_GET['date_to'] ?? null,
                'status' => $_GET['status'] ?? null,
                'category_id' => !empty($_GET['category_id']) ? (int) $_GET['category_id'] : null,
                'product_id' => !empty($_GET['product_id']) ? (int) $_GET['product_id'] : null,
            ];
            $result = $this->purchaseService->fetchPurchasesDetailsList($page, $limit, $filters);
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result['data'],
                'meta' => $result['meta'],
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function getPurchaseDetail($requestData)
    {
        try {
            $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
            if ($id < 1) {
                throw new InvalidArgumentException('id is required');
            }
            $purchase = $this->purchaseService->getPurchaseById($id);
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $purchase]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function addPurchaseItem($requestData)
    {
        try {
            if (
                empty($requestData['purchase_id']) ||
                empty($requestData['product']) ||
                empty($requestData['quantity']) ||
                !isset($requestData['price'])
            ) {
                throw new InvalidArgumentException('purchase_id, product, quantity, and price are required');
            }

            $result = $this->purchaseService->addPurchaseItem(
                (int) $requestData['purchase_id'],
                (int) $requestData['product'],
                (int) $requestData['quantity'],
                (float) $requestData['price']
            );

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            $code = $e->getMessage() === 'Unauthorized' ? 401 : 403;
            http_response_code($code);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function finalizePurchase($requestData)
    {
        try {
            if (empty($requestData['purchase_id'])) {
                throw new InvalidArgumentException('purchase_id is required');
            }

            $result = $this->purchaseService->finalizePurchase((int) $requestData['purchase_id']);

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            $code = $e->getMessage() === 'Unauthorized' ? 401 : 403;
            http_response_code($code);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function verifyPurchase($requestData)
    {
        try {
            if (empty($requestData['purchase_id'])) {
                throw new InvalidArgumentException('purchase_id is required');
            }

            $result = $this->purchaseService->verifyPurchase((int) $requestData['purchase_id']);

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            $code = $e->getMessage() === 'Unauthorized' ? 401 : 403;
            http_response_code($code);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function rejectPurchase($requestData)
    {
        try {
            if (empty($requestData['purchase_id'])) {
                throw new InvalidArgumentException('purchase_id is required');
            }

            $reason = $requestData['reason'] ?? null;
            $result = $this->purchaseService->rejectPurchase(
                (int) $requestData['purchase_id'],
                $reason ? (string) $reason : null
            );

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            $code = $e->getMessage() === 'Unauthorized' ? 401 : 403;
            http_response_code($code);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function updatePurchase($requestData)
    {
        try {
            if (empty($requestData['id']) || empty($requestData['vendor']) || empty($requestData['date'])) {
                throw new InvalidArgumentException('id, vendor, and date are required');
            }

            $result = $this->purchaseService->updatePurchase(
                (int) $requestData['id'],
                (int) $requestData['vendor'],
                (string) $requestData['date']
            );

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            $code = $e->getMessage() === 'Unauthorized' ? 401 : 403;
            http_response_code($code);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function deletePurchase($requestData)
    {
        try {
            $id = $requestData['id'] ?? ($_GET['id'] ?? null);
            if (empty($id)) {
                throw new InvalidArgumentException('id is required');
            }

            $result = $this->purchaseService->deletePurchase((int) $id);

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            $code = $e->getMessage() === 'Unauthorized' ? 401 : 403;
            http_response_code($code);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function fetchProductsByCategory()
    {
        $categoryId = isset($_GET['category_id']) ? (int) $_GET['category_id'] : null;

        if (!$categoryId) {
            echo json_encode(['data' => []]);
            return;
        }

        $products = $this->productModel->fetchByCategory($categoryId);
        echo json_encode(['data' => $products]);
    }

    public function fetchCategories()
    {
        $categories = $this->categoryModel->fetchAll();
        echo json_encode(['data' => $categories]);
    }

    public function getTotalPurchaseAmountByDateRange()
    {
        try {
            if (!isset($_GET['startDate'])) {
                throw new Exception('Start Date is required');
            }
            if (!isset($_GET['endDate'])) {
                throw new Exception('End Date is required');
            }

            $requestData = [
                'startDate' => (string) $_GET['startDate'],
                'endDate' => (string) $_GET['endDate'],
            ];

            $result = $this->purchaseService->getTotalPurchaseAmountByDateRange($requestData);
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Purchase Amount fetched Successfully!',
                'data' => ['totalPurchaseAmount' => $result],
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [],
            ]);
        }
    }

    public function getPurchaseAmountOfDateRange()
    {
        try {
            if (!isset($_GET['startDate'])) {
                throw new Exception('Start Date is required');
            }
            if (!isset($_GET['endDate'])) {
                throw new Exception('End Date is required');
            }

            $requestData = [
                'startDate' => (string) $_GET['startDate'],
                'endDate' => (string) $_GET['endDate'],
            ];

            $result = $this->purchaseService->getPurchaseAmountOfDateRange($requestData);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Purchase Amount of each date of date range fetched successfully!',
                'data' => $result,
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [],
            ]);
        }
    }
}
