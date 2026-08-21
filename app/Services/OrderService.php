<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Setting;
use App\Services\CartService;
use Illuminate\Support\Facades\DB;

class OrderService
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function createOrderFromCart($user, $transactionRef, string $paymentStatus = 'pending')
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

        if ($payment = Payment::where('transaction_ref', $transactionRef)->first()) {
            return $payment->order;
        }

        $order = Order::create([
            'user_id' => $user->id,
            'address_id' => $cart->address_id,
            'delivery_type' => $cart->delivery_type,
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'total' => $total,
            'status' => 'pending',
            'payment_status' => $paymentStatus,
            'phone' => $cart->phone,
            'order_notes' => $cart->order_notes,
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
            'status' => $paymentStatus,
        ]);

        return $order;
    }

    public function markPaid(string $transactionRef): ?Order
    {
        return DB::transaction(function () use ($transactionRef) {
            $payment = Payment::where('transaction_ref', $transactionRef)->lockForUpdate()->first();
            if (!$payment || $payment->status === 'paid') return $payment?->order;
            $payment->update(['status' => 'paid']);
            $payment->order->update(['payment_status' => 'paid']);
            $payment->order->user->cart?->items()->delete();
            return $payment->order;
        });
    }

    public function markFailed(string $transactionRef): ?Order
    {
        $payment = Payment::where('transaction_ref', $transactionRef)->first();
        if (!$payment || $payment->status === 'paid') return $payment?->order;
        $payment->update(['status' => 'failed']);
        $payment->order->update(['payment_status' => 'failed']);
        return $payment->order;
    }
}
