<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class MapboxService
{
public function getDrivingDistance($userLng, $userLat)
{
$restaurantLng = config('services.mapbox.restaurant_lng');
$restaurantLat = config('services.mapbox.restaurant_lat');
$token = config('services.mapbox.secret_token');

$url = "https://api.mapbox.com/directions/v5/mapbox/driving/{$restaurantLng},{$restaurantLat};{$userLng},{$userLat}";

$response = Http::get($url, [
'access_token' => $token,
'geometries' => 'geojson',
]);

if ($response->successful()) {
$data = $response->json();
// Mapbox returns distance in meters
$meters = $data['routes'][0]['distance'] ?? 0;
return round($meters / 1000, 2); // Convert to KM
}

return null;
}
}
