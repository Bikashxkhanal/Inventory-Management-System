<?php 
    use App\Controllers\Auth\AuthController;
    use App\Controllers\Session\CheckSession;
    use App\Controllers\User\UserController;
    use App\Controllers\Purchase\PurchaseController;
    use App\Controllers\Vendor\VendorController;
    use App\Controllers\Stock\StockController;
    use App\Controllers\Sales\SalesController;
    use App\Controllers\Product\ProductController;
    use App\Controllers\Product\ProductCatalogController;
    use App\Controllers\Vendor\VendorCatalogController;
    use App\Controllers\Category\CategoryController;



    return [
        'POST /api/auth/setup-company' => [AuthController::class, 'setupCompany'],
        'POST /api/auth/login'  => [AuthController::class, 'login'],
        'POST /api/auth/user-register' => [AuthController::class, 'superAdminSignup'],
        'POST /api/auth/otp-verification' => [AuthController::class , 'otpVerification'],
        'GET /api/auth/verify-user' => [CheckSession::class , 'verifyUser'],
        'POST /api/auth/logout' => [AuthController::class , 'logout'],
        'POST /api/staff/create' => [UserController::class, 'createUserAccount'],
        'GET /api/staff' => [UserController::class, 'fetchStaff'],
        'GET /api/staff/detail' => [UserController::class, 'getStaffDetail'],
        'PUT /api/staff' => [UserController::class, 'updateStaff'],
        'GET /api/staff/stats' => [UserController::class, 'fetchStaffStats'],
        'DELETE /api/staff' => [UserController::class, 'softDeleteStaff'],
        'POST /api/staff/approve' => [UserController::class, 'approveStaff'],
        'POST /api/staff/reject' => [UserController::class, 'rejectStaff'],
         // Purchase Endpoints
    'POST /api/purchase' => [PurchaseController::class, 'createPurchase'],
    'GET /api/purchase' => [PurchaseController::class, 'fetchPurchase'],
    'GET /api/purchase/details-list' => [PurchaseController::class, 'fetchPurchasesDetailsList'],
    'GET /api/purchase/detail' => [PurchaseController::class, 'getPurchaseDetail'],
    'GET /api/purchase/stats' => [PurchaseController::class, 'fetchPurchaseStats'],
    'POST /api/purchase/items' => [PurchaseController::class, 'addPurchaseItem'],
    'POST /api/purchase/finalize' => [PurchaseController::class, 'finalizePurchase'],
    'POST /api/purchase/verify' => [PurchaseController::class, 'verifyPurchase'],
    'POST /api/purchase/reject' => [PurchaseController::class, 'rejectPurchase'],
    'PUT /api/purchase' => [PurchaseController::class, 'updatePurchase'],
    'DELETE /api/purchase' => [PurchaseController::class, 'deletePurchase'],
    'GET /api/purchase/totalAmount' => [PurchaseController::class, 'getTotalPurchaseAmountByDateRange'],
    'GET /api/purchase/amount' => [PurchaseController::class, 'getPurchaseAmountOfDateRange'],

    // Product / Category Endpoints
    'GET /api/products' => [PurchaseController::class, 'fetchProductsByCategory'],
    'GET /api/categories' => [CategoryController::class, 'fetchAll'],
    'POST /api/categories' => [CategoryController::class, 'create'],

    'GET /api/products/search' => [ProductController::class , 'getSearchedProduct'],
    'GET /api/product' => [ProductController::class , 'getAProductDetail'],
    'GET /api/product/catalog' => [ProductCatalogController::class, 'listCatalog'],
    'POST /api/product' => [ProductCatalogController::class, 'createProduct'],
    'PUT /api/product' => [ProductCatalogController::class, 'updateProduct'],
    'DELETE /api/product' => [ProductCatalogController::class, 'deleteProduct'],
    'POST /api/product/approve' => [ProductCatalogController::class, 'approveProduct'],
    'POST /api/product/reject' => [ProductCatalogController::class, 'rejectProduct'],
    'PUT /api/product/selling-price' => [ProductCatalogController::class, 'updateSellingPrice'],
    
  'GET /api/vendors' => [VendorController::class, 'fetchVendors'],
  'GET /api/vendor/catalog' => [VendorCatalogController::class, 'listCatalog'],
  'POST /api/vendor' => [VendorCatalogController::class, 'createVendor'],
  'PUT /api/vendor' => [VendorCatalogController::class, 'updateVendor'],
  'DELETE /api/vendor' => [VendorCatalogController::class, 'deleteVendor'],
  'POST /api/vendor/approve' => [VendorCatalogController::class, 'approveVendor'],
  'POST /api/vendor/reject' => [VendorCatalogController::class, 'rejectVendor'],

  //stock
  'GET /api/stocks' => [StockController::class, 'fetchStocks'],
  'GET /api/stocks/stats' => [StockController::class, 'fetchStockStats'],

  //sales
   'GET /api/sales' => [SalesController::class, 'fetchSales'], //fetch sales data (entire for table)
   'GET /api/sales/details' => [SalesController::class, 'fetchSalesDetails'],
   'POST /api/sales' => [SalesController::class, 'createSale'], //create sell
   'GET /api/sales/totalAmount' => [SalesController::class, 'getTotalSalesAmountByDateRange'], //fetch sells total amount for dash
    'POST /api/sales/count' => [SalesController::class, 'getSalesCountByDateRange'], // fetch sells count  for dashboard
    'GET /api/sales/amount' => [SalesController::class , 'getSalesAmountOfDateRange'],  //fetch sells data for with date and amount for chart
    

    ];

?>