<?php

namespace App\Http\Controllers;

use App\Services\ChapaService;

class PaymentController extends Controller
{
    protected $chapa;

    public function __construct(ChapaService $chapa)
    {
        $this->chapa = $chapa;
    }

    public function pay()
    {
        $reference = $this->chapa->generateReference();

        $data = [
            'amount' => 100,
            'currency' => 'ETB',
            'email' => request()->email,
            'tx_ref' => $reference,
            'callback_url' => route('payment.callback', $reference),
            'first_name' => 'Yared',
            'last_name' => 'Mengiste',
            'customization' => [
                'title' => 'Restaurant Order',
                'description' => 'Payment for your food order',
            ],
        ];

        $response = $this->chapa->initPayment($data);

        if (($response['status'] ?? '') !== 'success') {
            return back()->with('error', 'Payment initialization failed');
        }

        return redirect()->away($response['data']['checkout_url']);
    }

    public function callback($reference)
    {
        $data = $this->chapa->verify($reference);

        if (($data['status'] ?? '') === 'success') {

            // 💰 Payment success – save order, update status, clear cart
            return "Payment Successful";
        }

        return "Payment Failed";
    }
}
