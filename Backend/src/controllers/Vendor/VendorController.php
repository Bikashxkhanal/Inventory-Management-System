<?php
namespace App\Controllers\Vendor;

use App\Models\VendorModel;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;
use Exception;

class VendorController {
    private VendorModel $vendorModel;

    public function __construct() {
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

    // GET /vendors
    public function fetchVendors() {
        try {
            $user = $this->currentUser();
            $vendors = $this->vendorModel->fetchAll(
                $user['company']['companyId'],
                $user['user']['role'] ?? ''
            );
            echo json_encode($vendors);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
