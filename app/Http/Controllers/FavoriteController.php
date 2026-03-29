<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 80/20: Only get products the user has favorited
        $favoriteProducts = Product::query()
            ->with(['category'])
            // Only include products that appear in the favorites table for this user
            ->whereHas('favorites', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            // Since we're on the favorites page, we know these are favorited
            ->withExists(['favorites as is_favourited' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->where('is_available', true)
            ->latest()
            ->get();

        return Inertia::render('Favorites/Index', [
            'products' => $favoriteProducts
        ]);
    }
}
