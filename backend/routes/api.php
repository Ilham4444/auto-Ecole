<?php
// routes/api.php
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;




Route::get('/test', function () {
    return response()->json([
        'message' => 'API Drive UP fonctionne!',
        'timestamp' => now(),
        'status' => 'success'
    ]);
});

     Route::post('/login', [AuthController::class, 'login']);
     Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
    
    Route::middleware('auth:sanctum')->get('dashboard', [DashboardController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

});
