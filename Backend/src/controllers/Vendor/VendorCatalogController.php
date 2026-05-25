<?php
namespace App\Controllers\Vendor;

use App\Models\VendorModel;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;
use Exception;

class VendorCatalogController
{
    private VendorModel $vendorModel;

    public function __construct()
    {
        $this->vendorModel = new VendorModel();
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
            $result = $this->vendorModel->fetchCatalog(
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

    public function createVendor(): void
    {
        try {
            $user = $this->currentUser();
            $this->requireRole(['superadmin', 'admin', 'manager']);
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            if (empty($input['name'])) {
                throw new Exception('Vendor name is required');
            }
            $id = $this->vendorModel->createVendor(
                $input,
                (int) ($user['user']['id'] ?? 0),
                $user['user']['role'] ?? ''
            );
            $pending = strtolower((string) ($user['user']['role'] ?? '')) !== 'superadmin';
            echo json_encode([
                'success' => true,
                'message' => $pending
                    ? 'Vendor submitted for superadmin approval'
                    : 'Vendor created',
                'data' => ['id' => $id],
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function updateVendor(): void
    {
        try {
            $this->requireRole(['superadmin', 'admin']);
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $id = (int) ($input['id'] ?? 0);
            if ($id < 1) {
                throw new Exception('Invalid vendor id');
            }
            $this->vendorModel->updateVendorRow($id, $input);
            echo json_encode(['success' => true, 'message' => 'Vendor updated']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function deleteVendor(): void
    {
        try {
            $this->requireRole(['superadmin', 'admin']);
            $id = (int) ($_GET['id'] ?? 0);
            $this->vendorModel->softDeleteVendor($id);
            echo json_encode(['success' => true, 'message' => 'Vendor removed']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function approveVendor(): void
    {
        $this->handleApproval(true);
    }

    public function rejectVendor(): void
    {
        $this->handleApproval(false);
    }

    private function handleApproval(bool $approve): void
    {
        try {
            $this->requireRole(['superadmin']);
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $id = (int) ($input['id'] ?? 0);
            $this->vendorModel->setVendorApproval($id, $approve);
            echo json_encode([
                'success' => true,
                'message' => $approve ? 'Vendor approved' : 'Vendor rejected',
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
