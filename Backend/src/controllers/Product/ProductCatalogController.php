<?php
namespace App\Controllers\Product;

use App\Models\ProductModel;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;
use Exception;

class ProductCatalogController
{
    private ProductModel $productModel;

    public function __construct()
    {
        $this->productModel = new ProductModel();
    }

    private function currentUser(): array
    {
        $session = new SessionService(new SessionManager());
        $user = $session->get('user');
        if (!$user) {
            throw new Exception('Unauthorized');
        }
        return $user;
    }

    private function requireRole(array $allowed): void
    {
        $role = strtolower((string) ($this->currentUser()['user']['role'] ?? ''));
        if (!in_array($role, $allowed, true)) {
            throw new Exception('Permission denied');
        }
    }

    public function listCatalog(): void
    {
        try {
            $user = $this->currentUser();
            $page = max(1, (int) ($_GET['page'] ?? 1));
            $limit = max(1, min(50, (int) ($_GET['limit'] ?? 10)));
            $search = isset($_GET['search']) ? trim((string) $_GET['search']) : null;
            $result = $this->productModel->fetchCatalog(
                $page,
                $limit,
                $search ?: null,
                $user['user']['role'] ?? ''
            );
            echo json_encode(['success' => true, 'data' => $result['data'], 'meta' => $result['meta']]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function createProduct(): void
    {
        try {
            $user = $this->currentUser();
            $this->requireRole(['superadmin', 'admin', 'manager']);
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            if (empty($input['name'])) {
                throw new Exception('Product name is required');
            }
            if (empty($input['category_id'])) {
                throw new Exception('Category is required');
            }
            $id = $this->productModel->createProduct(
                $input,
                (int) ($user['user']['id'] ?? 0),
                $user['user']['role'] ?? ''
            );
            $pending = strtolower((string) ($user['user']['role'] ?? '')) !== 'superadmin';
            echo json_encode([
                'success' => true,
                'message' => $pending
                    ? 'Product submitted for superadmin approval'
                    : 'Product created',
                'data' => ['id' => $id],
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function updateProduct(): void
    {
        try {
            $this->requireRole(['superadmin', 'admin']);
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $id = (int) ($input['id'] ?? 0);
            if ($id < 1) {
                throw new Exception('Invalid product id');
            }
            $this->productModel->updateProductRow($id, $input);
            echo json_encode(['success' => true, 'message' => 'Product updated']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function deleteProduct(): void
    {
        try {
            $this->requireRole(['superadmin', 'admin']);
            $id = (int) ($_GET['id'] ?? 0);
            if (!$this->productModel->softDeleteProduct($id)) {
                throw new Exception('Product not found or already removed');
            }
            echo json_encode(['success' => true, 'message' => 'Product hidden from catalog']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function approveProduct(): void
    {
        $this->handleApproval(true);
    }

    public function rejectProduct(): void
    {
        $this->handleApproval(false);
    }

    public function updateSellingPrice(): void
    {
        try {
            $this->requireRole(['superadmin']);
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $id = (int) ($input['product_id'] ?? $input['id'] ?? 0);
            if ($id < 1) {
                throw new Exception('Invalid product id');
            }
            if (!isset($input['selling_price'])) {
                throw new Exception('Selling price is required');
            }
            $price = (float) $input['selling_price'];
            if ($price < 0) {
                throw new Exception('Selling price cannot be negative');
            }
            $this->productModel->updateSellingPrice($id, $price);
            echo json_encode(['success' => true, 'message' => 'Selling price updated']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    private function handleApproval(bool $approve): void
    {
        try {
            $this->requireRole(['superadmin']);
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $id = (int) ($input['id'] ?? 0);
            $this->productModel->setProductApproval($id, $approve);
            echo json_encode([
                'success' => true,
                'message' => $approve ? 'Product approved' : 'Product rejected',
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
