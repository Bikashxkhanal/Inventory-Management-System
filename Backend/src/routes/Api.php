<?php 
    use App\Controllers\Auth\AuthController;
    use App\Controllers\Session\CheckSession;
    use App\Controllers\User\UserController;
    use App\Controllers\Purchase\PurchaseController;
    use App\Controllers\Vendor\VendorController;
    use App\Controllers\Stock\StockController;


    return [
        'POST /api/auth/setup-company' => [AuthController::class, 'setupCompany'],
        'POST /api/auth/login'  => [AuthController::class, 'login'],
        'POST /api/auth/user-register' => [AuthController::class, 'superAdminSignup'],
        'POST /api/auth/otp-verification' => [AuthController::class , 'otpVerification'],
        'GET /api/auth/verify-user' => [CheckSession::class , 'verifyUser'],
        'POST /api/auth/logout' => [AuthController::class , 'logout'],
        'POST /api/staff/create' => [UserController::class, 'createUserAccount'],
        'GET /api/staff' => [UserController::class, 'fetchStaff'],
        'GET /api/staff/stats' => [UserController::class, 'fetchStaffStats'],
         // Purchase Endpoints
    'POST /api/purchase' => [PurchaseController::class, 'createPurchase'],
    'GET /api/purchase' => [PurchaseController::class, 'fetchPurchase'],
    'GET /api/purchase/stats' => [PurchaseController::class, 'fetchPurchaseStats'],
    'POST /api/purchase/items' => [PurchaseController::class, 'addPurchaseItem'],

    // Product / Category Endpoints
    'GET /api/products' => [PurchaseController::class, 'fetchProductsByCategory'],
    'GET /api/categories' => [PurchaseController::class, 'fetchCategories'],

    
  'GET /api/vendors' => [VendorController::class, 'fetchVendors'],

  //stock
  'GET /api/stocks' => [StockController::class, 'fetchStocks'],
  'GET /api/stocks/stats' => [StockController::class, 'fetchStockStats'],


    ];

?>