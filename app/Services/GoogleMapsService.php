<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleMapsService
{
    public function getDrivingDistance($userLng, $userLat)
    {
        $restaurantLng = config('services.google.restaurant_lng');
        $restaurantLat = config('services.google.restaurant_lat');
        $apiKey = config('services.google.maps_api_key');

        // Google expects Origin and Destination as Lat,Lng
        $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
            'origins' => "{$restaurantLat},{$restaurantLng}",
            'destinations' => "{$userLat},{$userLng}",
            'key' => $apiKey,
        ]);

        if ($response->successful()) {
            $data = $response->json();

            // Check if Google successfully routed between the points
            if ($data['status'] === 'OK' && $data['rows'][0]['elements'][0]['status'] === 'OK') {
                // Distance is returned in meters
                $meters = $data['rows'][0]['elements'][0]['distance']['value'];
                return round($meters / 1000, 2); // Convert to KM
            }
        }

        return null;
    }
}
