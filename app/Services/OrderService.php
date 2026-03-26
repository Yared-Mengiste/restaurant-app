<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Setting;
use App\Services\CartService;

class OrderService
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function createOrderFromCart($user, $transactionRef)
    {
        $cart = $this->cartService->getCartWithItems($user);

        if (!$cart || $cart->items->isEmpty()) {
            return null;
        }

        $subtotal = $this->cartService->calculateSubtotal($cart);
        $deliveryFee = $cart->delivery_type === 'delivery'
            ? (float)(Setting::where('key', 'base_delivery_fee')->value('value'))
            : 0; // business logic
        $serviceCharge = $subtotal * 0.05;
        $total = $subtotal + $deliveryFee + $serviceCharge;

        // 1️⃣ Create order
        $order = Order::create([
            'user_id' => $user->id,
            'delivery_type' => $cart->delivery_type, // or pickup (frontend will choose)
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'total' => $total,
            'status' => 'pending',
            'payment_status' => 'paid',
        ]);

        // 2️⃣ Create items
        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'product_variant_id' => $item->product_variant_id,
                'price' => $item->variant ? $item->variant->price : $item->product->price,
            ]);
        }

        // 3️⃣ Create payment record
        Payment::create([
            'order_id' => $order->id,
            'transaction_ref' => $transactionRef,
            'amount' => $total,
            'status' => 'paid'
        ]);

        // 4️⃣ Clear the cart
        $cart->items()->delete();

        return $order;
    }
}
