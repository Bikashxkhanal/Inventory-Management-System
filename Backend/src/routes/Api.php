<?php 
    use App\Controllers\AuthController;
    use App\Controllers\DashboardController;
    return [
        'POST /api/auth/setup-company' => [AuthController::class, 'setupCompany'],
        'POST /api/auth/login'  => [AuthController::class, 'login'],
        'POST /api/auth/user-register' => [AuthController::class, 'signup'],
        'POST /api/auth/otp-verification' => [AuthController::class , 'otpVerification'],
        'GET /api/auth/verify-user' => [DashboardController::class , 'verifyUser'],
        'POST /api/auth/logout' => [AuthController::class , 'logout'],

    ];

?>