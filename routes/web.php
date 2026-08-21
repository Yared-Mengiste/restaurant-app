<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Product;

Route::get('/api/search', function (Request $request) {
    $query = trim((string) $request->input('q'));
    if ($query === '') return response()->json([]);

    return Product::where('is_available', true)
        ->where(fn ($builder) => $builder->where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%"))
        ->limit(6)
        ->get(['id', 'name', 'image', 'price']);
})->middleware('throttle:60,1')->name('api.search');

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::view('/privacy', 'legal.privacy')->name('legal.privacy');
Route::view('/terms', 'legal.terms')->name('legal.terms');
Route::view('/contact', 'legal.contact')->name('legal.contact');
Route::get('/sitemap.xml', function () {
    return response()->view('sitemap')->header('Content-Type', 'application/xml');
})->name('sitemap');


// Social Authentication
Route::get('auth/google', [SocialiteController::class, 'googleLogin'])->name('auth.google');
Route::get('auth/google-callback', [SocialiteController::class, 'googleAuthentication'])->name('auth.google-callback');
Route::post('/payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');

/*
|--------------------------------------------------------------------------
| Admin Territory (Protected by Admin Middleware)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard & Orders
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/orders', [DashboardController::class, 'index'])->name('orders');
    Route::patch('/orders/{order}', [DashboardController::class, 'updateStatus'])->name('orders.update');

    // Products Management
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{id}', [ProductController::class, 'adminShow'])->name('products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');

    // Note: Using POST for updates to handle multipart/form-data with _method spoofing
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::patch('/products/{product}/toggle-availability', [ProductController::class, 'toggleAvailability'])->name('products.toggle');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{id}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::post('/categories/{id}', [CategoryController::class, 'update'])->name('categories.update'); // Using POST for file support
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');});

/*
|--------------------------------------------------------------------------
| Customer Territory (Protected by Auth & Customer Middleware)
|--------------------------------------------------------------------------
| This prevents Admins from accessing Cart/Payment/Profile routes.
*/
Route::middleware(['auth', 'customer'])->group(function () {
    // Cart Management
    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::post('/products/{product}/favorite', [ProductController::class, 'toggleFavorite'])->name('products.favorite')->middleware('auth');
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::get('/orders/history', [OrderController::class, 'history'])->name('orders.history');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store')->middleware('throttle:60,1');
    Route::put('/cart', [CartController::class, 'update'])->name('cart.update')->middleware('throttle:60,1');
    Route::delete('/cart', [CartController::class, 'destroy'])->name('cart.destroy')->middleware('throttle:60,1');
    Route::post('/cart/delivery', [CartController::class, 'updateDeliveryType'])->name('cart.update-delivery-type');
    Route::post('/cart/checkout-details', [CartController::class, 'updateCheckoutDetails'])->name('cart.update-checkout-details');
    Route::post('/cart/address', [CartController::class, 'updateAddress'])->name('cart.update-address');

    // Checkout & Payment
    Route::post('/pay', [PaymentController::class, 'pay'])->name('payment.pay')->middleware('throttle:10,1');
    Route::get('/payment/callback/{reference}', [PaymentController::class, 'callback'])->name('payment.callback');
    Route::get('/order/success/{order}', function ($orderId) {
        return inertia('Order/OrderSuccess', ['orderId' => $orderId]);
    })->name('order.success');
    Route::get('/payment/failed', function () {
        return inertia('Order/PaymentFailed');
    })->name('payment.failed');

    // User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Auth Routes (Breeze/Fortify)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
