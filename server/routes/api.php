<?php

use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\Auth\LoginController;
use App\Http\Controllers\API\Auth\LogoutController;
use App\Http\Controllers\API\Auth\PasswordChangeController;
use App\Http\Controllers\API\Auth\RegisterController;
use App\Http\Controllers\API\BranchCodeController;
use App\Http\Controllers\API\BranchUnitController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ComputerController;
use App\Http\Controllers\API\ComputerUserController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\EmailController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\PositionController;
use App\Http\Controllers\API\SupplierController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\LogController;
use App\Http\Controllers\API\UserController;
use App\Models\BranchCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// POST
Route::post('/register', [RegisterController::class, 'store']);
Route::get('/branch-code', [BranchCodeController::class, 'branchCode']);
Route::post('/login', [LoginController::class, 'login']);
Route::put('/change-new-password/{id}', [PasswordChangeController::class, 'update']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);

Route::middleware("auth:sanctum")->group(function () {
    // GET
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::get('/logout', [LogoutController::class, 'logout']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/units', [UnitController::class, 'index']);
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::get('/branches', [BranchCodeController::class, 'index']);
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/positions', [PositionController::class, 'index']);
    Route::get('/computer-users', [ComputerUserController::class, 'index']);
    Route::get('/computers', [ComputerController::class, 'index']);
    Route::get('/computer-user-edit/{id}', [ComputerUserController::class, 'edit']);
    Route::get('/computer-user-specs/{id}', [ComputerUserController::class, 'viewSpecs']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/unread-notifications', [NotificationController::class, 'index']);
    Route::get('/logs', [LogController::class, 'index']);
    Route::get('/admin/users-list', [UserController::class, 'index']);
    Route::get('/edit-branch-code/{id}', [BranchCodeController::class, 'edit']);
    Route::get('/edit-category/{id}', [CategoryController::class, 'edit']);
    Route::get('/edit-department/{id}', [DepartmentController::class, 'edit']);
    Route::get('/edit-position/{id}', [PositionController::class, 'edit']);
    Route::get('/edit-supplier/{id}', [SupplierController::class, 'edit']);
    Route::get('/branch-units', [BranchUnitController::class, 'index']);
    Route::get('/branch-unit-edit/{id}', [BranchUnitController::class, 'edit']);

    // POST
    Route::post('/add-category', [CategoryController::class, 'store']);
    Route::post('/add-unit', [UnitController::class, 'store']);
    Route::post('/add-supplier', [SupplierController::class, 'store']);
    Route::post('/add-branch', [BranchCodeController::class, 'store']);
    Route::post('/add-position', [PositionController::class, 'store']);
    Route::post('/add-department', [DepartmentController::class, 'store']);
    Route::post('/add-computer-user', [ComputerUserController::class, 'store']);
    Route::post('/add-computer', [ComputerController::class, 'store']);
    Route::post('/send-email', [EmailController::class, 'sendNotificationToAllUsers']);
    Route::post('/computer/{computerId}/unit/action', [ComputerController::class, 'unitAction']);
    Route::post('/branch-unit/{branchUnitId}/unit/action', [BranchUnitController::class, 'unitAction']);
    Route::post('/computers/install-application/add-remarks/{computerId}', [ComputerController::class, 'installAndRemark']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/marked-as-read/{notificationId}', [NotificationController::class, 'read']);
    Route::post('/marked-all-as-read', [NotificationController::class, 'markedAllAsRead']);
    Route::post('/update-unit/{id}', [UnitController::class, 'update']);
    Route::post('/cleaning-complete/{id}', [ComputerController::class, 'doneCleaning']);
    Route::post('/update-branch-code/{id}', [BranchCodeController::class, 'update']);
    Route::post('/update-category/{id}', [CategoryController::class, 'update']);
    Route::post('/update-department/{id}', [DepartmentController::class, 'update']);
    Route::post('/update-position/{id}', [PositionController::class, 'update']);
    Route::post('/update-supplier/{id}', [SupplierController::class, 'update']);
    Route::post('/add-branch-unit', [BranchUnitController::class, 'store']);

    // PUT
    Route::put('/installed/{computerId}/computer-user/{computerUserId}', [ComputerController::class, 'updateApplicationAndUserDetails']);

    // DELETE
    Route::delete('/branch-delete/{id}', [BranchCodeController::class, 'destroy']);
    Route::delete('/category-delete/{id}', [CategoryController::class, 'destroy']);
    Route::delete('/department-delete/{id}', [DepartmentController::class, 'destroy']);
    Route::delete('/position-delete/{id}', [PositionController::class, 'destroy']);
    Route::delete('/supplier-delete/{id}', [SupplierController::class, 'destroy']);
    Route::delete('/unit-delete/{id}', [UnitController::class, 'destroy']);
    Route::delete('/computer-user/{computer_user}/delete', [ComputerUserController::class, 'destroy']);
});

// GET
Route::get('/computers/{id}', [ComputerController::class, 'show']);

// POST
// PUT
// DELETE
