<?php 
    use App\Controllers\AuthController;
    return [
        'POST /api/auth/setup-company' => [AuthController::class, 'setupCompany'],
        'POST api/login'  => [AuthController::class, 'login'],
        'POST api/signup' => [AuthController::class, 'signup'],
        'POST /api/auth/otp-verification' => [AuthController::class , 'otpVerification'],

    ];

?>