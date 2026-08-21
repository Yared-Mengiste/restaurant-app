<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleMapsService
{
    public function getDrivingDistance(float $userLng, float $userLat): ?float
    {
        $restaurantLng = config('services.google.restaurant_lng');
        $restaurantLat = config('services.google.restaurant_lat');
        $apiKey = config('services.google.maps_api_key');

        // Google expects Origin and Destination as Lat,Lng
        if (!$apiKey) return null;

        $response = Http::timeout(10)->retry(2, 200)->get('https://maps.googleapis.com/maps/api/distancematrix/json', [
            'origins' => "{$restaurantLat},{$restaurantLng}",
            'destinations' => "{$userLat},{$userLng}",
            'key' => $apiKey,
        ]);

        if ($response->successful()) {
            $data = $response->json();

            // Check if Google successfully routed between the points
            if (($data['status'] ?? null) === 'OK' && data_get($data, 'rows.0.elements.0.status') === 'OK') {
                // Distance is returned in meters
                $meters = data_get($data, 'rows.0.elements.0.distance.value');
                return round($meters / 1000, 2); // Convert to KM
            }
        }

        return null;
    }
}
