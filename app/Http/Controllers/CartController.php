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


    }
    public function updateDeliveryType(Request $request)
    {
        $user = $request->user();
        $cart = $this->cartService->getCart($user);

        $cart->delivery_type = $request->type;


        $cart->save();

        return back()->with('success', 'Updated delivery type');
    }

    public function updateCheckoutDetails(Request $request)
    {
        $data = $request->validate([
            'address_line' => ['required_if:delivery_type,delivery', 'nullable', 'string', 'max:500'],
            'phone' => ['required', 'string', 'max:30'],
            'order_notes' => ['nullable', 'string', 'max:1000'],
            'delivery_type' => ['required', 'in:pickup,delivery'],
        ]);

        $cart = $this->cartService->getCart($request->user());
        $cart->delivery_type = $data['delivery_type'];
        $cart->phone = $data['phone'];
        $cart->order_notes = $data['order_notes'] ?? null;

        if ($data['delivery_type'] === 'delivery') {
            $address = $request->user()->addresses()->updateOrCreate(
                ['id' => $cart->address_id],
                ['address_line' => $data['address_line'], 'latitude' => 9.03, 'longitude' => 38.74],
            );
            $cart->address_id = $address->id;
        } else {
            $cart->address_id = null;
        }

        $cart->save();

        return back()->with('success', 'Checkout details saved');
    }
}
