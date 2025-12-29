<?php 
    use App\Controllers\Auth\AuthController;
    use App\Controllers\Session\CheckSession;
    return [
        'POST /api/auth/setup-company' => [AuthController::class, 'setupCompany'],
        'POST /api/auth/login'  => [AuthController::class, 'login'],
        'POST /api/auth/user-register' => [AuthController::class, 'superAdminSignup'],
        'POST /api/auth/otp-verification' => [AuthController::class , 'otpVerification'],
        'GET /api/auth/verify-user' => [CheckSession::class , 'verifyUser'],
        'POST /api/auth/logout' => [AuthController::class , 'logout'],

    ];

?>