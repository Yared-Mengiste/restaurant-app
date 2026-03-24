<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ChapaService
{
    public function generateReference()
    {
        return 'chapa_' . uniqid(time());
    }

    public function initPayment(array $data)
    {
        return Http::withToken(config('services.chapa.secret'))
            ->post('https://api.chapa.co/v1/transaction/initialize', $data)
            ->json();
    }

    public function verify($reference)
    {
        return Http::withToken(config('services.chapa.secret'))
            ->get("https://api.chapa.co/v1/transaction/verify/{$reference}")
            ->json();
    }
}
