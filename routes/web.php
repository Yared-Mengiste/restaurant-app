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
