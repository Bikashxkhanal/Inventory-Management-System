<?php
namespace App\Controllers\Purchase;

use App\Models\PurchaseModel;
use App\Models\PurchaseItemsModel;
use App\Models\ProductModel;
use App\Models\CategoryModel;
use App\Services\PurchaseService;

class PurchaseController {
    private PurchaseService $purchaseService;
    private ProductModel $productModel;
    private CategoryModel $categoryModel;

    // Constructor: instantiate dependencies internally
    public function __construct() {
        // Database connection

        // Models
        $purchaseModel = new PurchaseModel();
        $purchaseItemModel = new PurchaseItemsModel();
        $this->productModel = new ProductModel();
        $this->categoryModel = new CategoryModel();

        // Service
        $this->purchaseService = new PurchaseService($purchaseModel, $purchaseItemModel, $this->productModel);
    }


    public function createPurchase($requestData) {
        $purchaseId = $this->purchaseService->createPurchase(
            $requestData['vendor'], 
            $requestData['date'],
            $requestData['totalValue'],

        );
        echo json_encode(['id' => $purchaseId]);
    }

   public function fetchPurchase($requestData) {
    $page = !empty($requestData['page']) ? (int)$requestData['page'] : 1;
    $limit = !empty($requestData['limit']) ? (int)$requestData['limit'] : 10;

    $data = $this->purchaseService->fetchPaginated($page, $limit);
    echo json_encode(['data' => $data]);
}


    public function fetchPurchaseStats() {
        $stats = $this->purchaseService->fetchStats();
        echo json_encode($stats);
    }

    public function addPurchaseItem($requestData) {
        $result = $this->purchaseService->addPurchaseItem(
            $requestData['purchase_id'],
            $requestData['product'],
            $requestData['quantity'],
            $requestData['price']
        );
        echo json_encode($result);
    }

 public function fetchProductsByCategory() {
    $categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;

    if (!$categoryId) {
        echo json_encode(['data' => []]);
        return;
    }

    $products = $this->productModel->fetchByCategory($categoryId);
    echo json_encode(['data' => $products]);
}



    public function fetchCategories() {
        $categories = $this->categoryModel->fetchAll();
        echo json_encode(['data' => $categories]);
    }
}
