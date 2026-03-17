<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CartService;

class CartController extends Controller
{
protected $cartService;

public function __construct(CartService $cartService)
{
$this->middleware('auth');
$this->cartService = $cartService;
}

public function index(Request $request)
{
$cart = $this->cartService->getCartWithItems($request->user());

return inertia('Cart', [
'cart' => $cart,
'total' => $this->cartService->calculateTotal($cart),
]);
}

public function store(Request $request)
{
$request->validate([
'product_id' => 'required|exists:products,id',
'quantity' => 'integer|min:1'
]);

return back()->with([
'cart' => $this->cartService->addToCart(
$request->user(),
$request->product_id,
$request->quantity ?? 1
)
]);
}

public function update(Request $request)
{
$request->validate([
'product_id' => 'required|exists:products,id',
'quantity' => 'required|integer|min:1'
]);

return back()->with([
'cart' => $this->cartService->updateQuantity(
$request->user(),
$request->product_id,
$request->quantity
)
]);
}

public function destroy(Request $request)
{
$request->validate([
'product_id' => 'required|exists:products,id'
]);

return back()->with([
'cart' => $this->cartService->removeItem(
$request->user(),
$request->product_id
)
]);
}
}
