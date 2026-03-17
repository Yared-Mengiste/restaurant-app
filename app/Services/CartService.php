<?php
namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartService
{
public function getCart($user)
{
return Cart::firstOrCreate(
['user_id' => $user->id],
[]
);
}

public function addToCart($user, $productId, $quantity = 1)
{
$cart = $this->getCart($user);

$item = CartItem::where('cart_id', $cart->id)
->where('product_id', $productId)
->first();

if ($item) {
$item->quantity += $quantity;
$item->save();
} else {
CartItem::create([
'cart_id' => $cart->id,
'product_id' => $productId,
'quantity' => $quantity,
]);
}

return $this->getCartWithItems($user);
}

public function updateQuantity($user, $productId, $quantity)
{
$cart = $this->getCart($user);

$item = CartItem::where('cart_id', $cart->id)
->where('product_id', $productId)
->firstOrFail();

$item->quantity = $quantity;
$item->save();

return $this->getCartWithItems($user);
}

public function removeItem($user, $productId)
{
$cart = $this->getCart($user);

CartItem::where('cart_id', $cart->id)
->where('product_id', $productId)
->delete();

return $this->getCartWithItems($user);
}

public function getCartWithItems($user)
{
return Cart::with('items.product')
->where('user_id', $user->id)
->first();
}

public function calculateTotal($cart)
{
return $cart->items->sum(function ($item) {
return $item->product->price * $item->quantity;
});
}
}
