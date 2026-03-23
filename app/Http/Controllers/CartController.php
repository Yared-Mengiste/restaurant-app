<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CartService;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        return inertia('Cart/Index', [
            'cart' => $this->cartService->getCartWithItems($user),
            'summary' => $this->cartService->getSummary($user)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id', // ✅ FIXED
            'quantity' => 'integer|min:1'
        ]);

        $this->cartService->addToCart(
            $request->user(),
            $request->product_id,
            $request->quantity ?? 1,
            $request->product_variant_id // ✅ FIXED
        );

        return back()->with('success', 'Added to cart');
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id', // ✅ FIXED
            'quantity' => 'required|integer|min:1'
        ]);

        $this->cartService->updateQuantity(
            $request->user(),
            $request->product_id,
            $request->quantity,
            $request->product_variant_id // ✅ FIXED
        );

        return back()->with('success', 'Cart updated');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id' // ✅ FIXED
        ]);

        $this->cartService->removeItem(
            $request->user(),
            $request->product_id,
            $request->product_variant_id // ✅ FIXED
        );

        return back()->with('success', 'Item removed');
    }
}
