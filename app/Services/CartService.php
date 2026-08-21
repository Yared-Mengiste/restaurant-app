<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Setting;
use function Laravel\Prompts\number;

class CartService
{
    public function getCart($user)
    {
        return Cart::firstOrCreate([
            'user_id' => $user->id
        ]);
    }

    public function addToCart($user, $productId, $quantity = 1, $variantId = null)
    {
        $cart = $this->getCart($user);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId) // ✅ IMPORTANT
            ->first();

        if ($item) {
            $item->quantity += $quantity;
            $item->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'product_variant_id' => $variantId, // ✅ support variants
                'quantity' => $quantity,
            ]);
        }

        return $this->getCartWithItems($user);
    }

    public function updateQuantity($user, $productId, $quantity, $product_variant_id = null)
    {
        $cart = $this->getCart($user);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->when($product_variant_id, function ($query, $product_variant_id) {
                return $query->where('product_variant_id', $product_variant_id);
            }, function ($query) {
                return $query->whereNull('product_variant_id');
            })
            ->firstOrFail();

        $item->quantity = $quantity;
        $item->save();

        // 80/20 Tip: Return the fresh cart to ensure the frontend gets updated totals
        return $this->getCartWithItems($user);
    }

    public function removeItem($user, $productId, $variantId = null)
    {
        $cart = $this->getCart($user);

        CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId)
            ->delete();

        return $this->getCartWithItems($user);
    }

    public function getCartWithItems($user)
    {
        return Cart::with(['items.product', 'items.variant', 'address'])
            ->where('user_id', $user->id)
            ->first();
    }

    /**
     * ✅ SINGLE SOURCE OF TRUTH FOR PRICING
     */
    public function calculateSubtotal($cart)
    {
        if (!$cart || !$cart->items) return 0;

        return $cart->items->sum(function ($item) {
            $price = $item->variant
                ? $item->variant->price
                : $item->product->price;

            return $price * $item->quantity;
        });
    }

    /**
     * ✅ FULL SUMMARY (BEST PRACTICE)
     */
    public function getSummary($user)
    {
        $cart = $this->getCartWithItems($user);

        if (!$cart || $cart->items->isEmpty()) {
            return [
                'count' => 0,
                'subtotal' => 0,
                'delivery_type' => 'pickup',
                'delivery_fee' => 0,
                'service_charge' => 0,
                'total' => 0,
            ];
        }

        // subtotal from product items
        $subtotal = $this->calculateSubtotal($cart);

        // delivery fee depends on delivery_type
        $deliveryFee = $cart->delivery_type === 'delivery'
            ? (float)(Setting::where('key', 'base_delivery_fee')->value('value'))
            : 0;

        // example: service charge logic
        $serviceCharge = $subtotal * 0.05;

        return [
            'count' => $cart->items->sum('quantity'),
            'subtotal' => $subtotal,
            'delivery_type' => $cart->delivery_type,
            'delivery_fee' => $deliveryFee,
            'service_charge' => $serviceCharge,
            'total' => $subtotal + $deliveryFee + $serviceCharge,
        ];
    }
    public function buildInvoice($user)
    {
        $cart = $this->getCartWithItems($user);

        if (!$cart || $cart->items->isEmpty()) {
            return [];
        }

        return $cart->items->map(function ($item) {
            $name = $item->product->name;

            if ($item->variant) {
                $name .= " ({$item->variant->name})";
            }

            return [
                'key' => $name,
                'value' => $item->quantity . ' pcs'
            ];
        })->toArray();
    }
}
