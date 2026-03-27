<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChapaService
{
    /**
     * Generate a unique transaction reference.
     */
    public function generateReference(): string
    {
        // Using 'tx_' prefix + timestamp + random string for better uniqueness
        return 'tx_' . time() . bin2hex(random_bytes(4));
    }

    /**
     * Initialize transaction with Chapa.
     */
    public function initPayment(array $data)
    {
        try {
            $response = Http::withToken(config('services.chapa.secret'))
                ->timeout(10) // Prevents your app from hanging if Chapa is slow
                ->post('https://api.chapa.co/v1/transaction/initialize', $data);

            if ($response->failed()) {
                Log::error('Chapa Initialization Failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Chapa Service Error: ' . $e->getMessage());
            return ['status' => 'error', 'message' => 'Connection to payment gateway failed'];
        }
    }

    /**
     * Verify the transaction status.
     */
    public function verify(string $reference)
    {
        try {
            $response = Http::withToken(config('services.chapa.secret'))
                ->get("https://api.chapa.co/v1/transaction/verify/{$reference}");

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Chapa Verification Error: ' . $e->getMessage());
            return ['status' => 'error'];
        }
    }
}
