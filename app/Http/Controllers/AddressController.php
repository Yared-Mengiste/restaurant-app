<?php

namespace App\Http\Controllers;

// 1. Ensure you are importing the correct Service
use App\Services\GoogleMapsService;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * 2. Change the Type-hint from MapboxService to GoogleMapsService.
     * 3. Change the variable name to $googleMaps to match your function call.
     */
    public function store(Request $request, GoogleMapsService $googleMaps)
    {
        $validated = $request->validate([
            'address_line' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // 4. Calculate distance using the newly injected service
        $distance = $googleMaps->getDrivingDistance($validated['longitude'], $validated['latitude']);

        // Check constraint: MAX_DISTANCE_KM
        if ($distance > config('services.delivery.max_km')) {
            return back()->with('error', 'Location is outside our delivery zone.');
        }

        $address = $request->user()->addresses()->create([
            'address_line' => $validated['address_line'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'distance_km' => $distance,
        ]);

        return back()->with('success', 'Address saved!');
    }
}
