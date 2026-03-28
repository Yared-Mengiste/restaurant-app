<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CartController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\DashboardController;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard & Orders
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/orders', [DashboardController::class, 'index'])->name('orders');
    Route::patch('/orders/{order}', [DashboardController::class, 'updateStatus'])->name('orders.update');

    // Products Management
    Route::get('/products', [ProductController::class, 'index'])->name('products');

    // 1. Add Create & Store Routes
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');

    // 2. Add Edit & Update Routes
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');

    /** * NOTE: We use POST for update because of the Multipart/Form-Data limitation
     * in PHP/Laravel where PATCH/PUT cannot parse file uploads.
     * Your React form handles this by adding _method: 'PATCH' to the data.
     */
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');

    Route::patch('/products/{product}/toggle-availability', [ProductController::class, 'toggleAvailability'])->name('products.toggle');

    // 3. Add Delete Route (if supported by your service) [cite: 49]
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Categories
    Route::get('/categories', function() { return inertia('Admin/Categories'); })->name('categories');
});

Route::resource('products', ProductController::class);
// routes/web.php

Route::post('/pay', [PaymentController::class, 'pay'])->name('payment.pay');
Route::get('/payment/callback/{reference}', [PaymentController::class, 'callback'])->name('payment.callback');
Route::get('auth/google', [SocialiteController::class, 'googleLogin'])
    ->name('auth.google');

Route::get('/order/success/{order}', function ($orderId) {
    return inertia('Order/OrderSuccess', ['orderId' => $orderId]);
})->name('order.success');

Route::get('/payment/failed', function () {
    return inertia('Order/PaymentFailed');
})->name('payment.failed');

Route::get('auth/google-callback', [SocialiteController::class, 'googleAuthentication'])
    ->name('auth.google-callback');
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/menu', [MenuController::class, 'index'])->name('menu.index');

Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/cart/delivery', [CartController::class, 'updateDeliveryType'])
        ->name('cart.update-delivery-type');
});

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});

//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
