<?php

namespace App\Http\Controllers;

use App\Services\ChapaService;
use App\Services\CartService;
use App\Services\OrderService;
use App\Models\Payment;
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
            'return_url' => route('payment.callback', $reference), // Where user goes after paying
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

        $order = app(OrderService::class)->createOrderFromCart($user, $reference);
        if (!$order) return response()->json(['error' => 'Unable to create order'], 422);

//        $response = $this->chapa->initPayment($data);
//
//        if (($response['status'] ?? '') !== 'success') {
//            return back()->with('error', 'Payment initialization failed');
//        }
//
//        return redirect()->away($response['data']['checkout_url']);
        $response = $this->chapa->initPayment($data);

        if (($response['status'] ?? '') !== 'success') {
            // Return JSON error so React can show an alert
            return response()->json(['error' => 'Payment initialization failed'], 422);
        }

        // RETURN JSON instead of redirect()->away()
        return response()->json([
            'checkout_url' => $response['data']['checkout_url']
        ]);
    }

    // ... callback method remains the same


    public function callback($reference)
    {
        return $this->completePayment($reference);
    }

    public function webhook(Request $request)
    {
        $reference = $request->input('tx_ref') ?: $request->input('reference');
        if (!$reference) return response()->json(['error' => 'Missing transaction reference'], 422);
        return $this->completePayment($reference, true);
    }

    protected function completePayment(string $reference, bool $webhook = false)
    {
        $data = $this->chapa->verify($reference);
        $orders = app(OrderService::class);
        $payment = Payment::where('transaction_ref', $reference)->first();
        $verifiedAmount = (float) data_get($data, 'data.amount', -1);

        if (($data['status'] ?? '') === 'success' && $payment && abs($verifiedAmount - (float) $payment->amount) < 0.01) {
            $order = $orders->markPaid($reference);
            if ($webhook) return response()->json(['status' => 'ok']);
            return redirect()->route('order.success', ['order' => $order?->id]);
        }

        $orders->markFailed($reference);
        if ($webhook) return response()->json(['status' => 'failed'], 422);
        return redirect()->route('payment.failed');
    }
}
