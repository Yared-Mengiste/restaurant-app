<?php

namespace App\Http\Controllers;

use App\Services\MapboxService;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    //
    public function store(Request $request, MapboxService $mapbox)
    {
        $validated = $request->validate([
            'address_line' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Calculate distance ONCE on creation
        $distance = $mapbox->getDrivingDistance($validated['longitude'], $validated['latitude']);
//        \Log::info("Distance calculated: " . $distance . " km");

        // Check constraint: MAX_DISTANCE_KM
        if ($distance > config('services.delivery.max_km')) {
//            return back()->withErrors(['address' => 'Location is outside our delivery zone.']);
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
