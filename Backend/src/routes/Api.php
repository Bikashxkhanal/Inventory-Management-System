<?php 
    use App\Controllers\Auth\AuthController;
    use App\Controllers\Session\CheckSession;
    use App\Controllers\User\UserController;
    use App\Controllers\Purchase\PurchaseController;
    use App\Controllers\Vendor\VendorController;
    use App\Controllers\Stock\StockController;
    use App\Controllers\Sales\SalesController;
    use App\Controllers\Product\ProductController;



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
    'GET /api/purchase/totalAmount' => [PurchaseController::class, 'getTotalPurchaseAmountByDateRange'],
    'GET /api/purchase/amount' => [PurchaseController::class, 'getPurchaseAmountOfDateRange'],

    // Product / Category Endpoints
    'GET /api/products' => [PurchaseController::class, 'fetchProductsByCategory'],
    'GET /api/categories' => [PurchaseController::class, 'fetchCategories'],

    'GET /api/products/search' => [ProductController::class , 'getSearchedProduct'],
    'GET /api/product' => [ProductController::class , 'getAProductDetail'],
    
  'GET /api/vendors' => [VendorController::class, 'fetchVendors'],

  //stock
  'GET /api/stocks' => [StockController::class, 'fetchStocks'],
  'GET /api/stocks/stats' => [StockController::class, 'fetchStockStats'],

  //sales
   'GET /api/sales' => [SalesController::class, 'fetchSales'], //fetch sales data (entire for table)
   'POST /api/sales' => [SalesController::class, 'createSale'], //create sell
   'GET /api/sales/totalAmount' => [SalesController::class, 'getTotalSalesAmountByDateRange'], //fetch sells total amount for dash
    'POST /api/sales/count' => [SalesController::class, 'getSalesCountByDateRange'], // fetch sells count  for dashboard
    'GET /api/sales/amount' => [SalesController::class , 'getSalesAmountOfDateRange'],  //fetch sells data for with date and amount for chart
    

    ];

?>