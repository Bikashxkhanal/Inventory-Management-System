<?php
namespace App\Controllers\Vendor;

use App\Models\VendorModel;
use App\Database\Database;

class VendorController {
    private VendorModel $vendorModel;

    public function __construct() {
        $this->vendorModel = new VendorModel();
    }

    // GET /vendors
    public function fetchVendors() {
        $vendors = $this->vendorModel->fetchAll();
        echo json_encode($vendors);
    }
}
