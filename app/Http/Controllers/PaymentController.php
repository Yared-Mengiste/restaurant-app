<?php

namespace App\Http\Controllers;

use App\Services\ChapaService;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $chapa;
    protected $cartService;

    public function __construct(ChapaService $chapa, CartService $cartService)
    {
        $this->chapa = $chapa;
        $this->cartService = $cartService;
    }

    public function pay(Request $request)
    {
        $user = $request->user();

        // 1. Fetch current cart and summary
        $cart = $this->cartService->getCartWithItems($user);

        if (!$cart || $cart->items->isEmpty()) {
            return back()->with('error', 'Your cart is empty');
        }

        $summary = $this->cartService->getSummary($user);
        $reference = $this->chapa->generateReference();

        // 2. Map cart items to the "meta" format for Chapa
        $metaInvoices = $cart->items->map(function ($item) {
            $name = $item->product->name . ($item->variant ? " ({$item->variant->name})" : "");
            return [
                'key' => $name,
                'value' => $item->quantity . " pcs"
            ];
        })->toArray();

        // 3. Prepare the Chapa payload
        $data = [
            'amount' => $summary['total'], // Dynamic total from cart
            'currency' => 'ETB',
            'email' => $user->email,
            'tx_ref' => $reference,
            'callback_url' => route('payment.callback', $reference),
            'return_url' => route('cart.index'), // Where user goes after paying
            'first_name' => $user->name,
            'last_name' => '', // Split name if necessary
            'customization' => [
                'title' => 'Restaurant Order',
                'description' => 'Payment for order containing ' . $summary['count'] . ' items',
            ],
            'meta' => [
                'invoices' => $metaInvoices
            ]
        ];

        $response = $this->chapa->initPayment($data);

        if (($response['status'] ?? '') !== 'success') {
            return back()->with('error', 'Payment initialization failed');
        }

        return redirect()->away($response['data']['checkout_url']);
    }

    // ... callback method remains the same


    public function callback($reference)
    {
        $data = $this->chapa->verify($reference);

        if (($data['status'] ?? '') === 'success') {

            $order = app(OrderService::class)->createOrderFromCart(auth()->user(), $reference);

            return redirect()->route('order.success', ['order' => $order->id]);
        }

        return redirect()->route('payment.failed');
    }
}
