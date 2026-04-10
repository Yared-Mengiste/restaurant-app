<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user() && $request->user()->role === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }
        $search = $request->input('search');
        $categoryId = $request->input('category_id');
        $user = $request->user();

        // Base query for all products
        $productsQuery = Product::query()
            ->with(['category'])
            ->where('is_available', true)
            // Check if a favorite record exists for the current user
            ->when($user, function ($query) use ($user) {
                $query->withExists(['favorites as is_favourited' => function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                }]);
            })
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($categoryId, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->latest();

        $products = $productsQuery->get();

        // Featured section logic
        $featured = [];
        if (!$search && !$categoryId) {
            $featured = Product::where('is_featured', true)
                ->where('is_available', true)
                ->when($user, function ($query) use ($user) {
                    $query->withExists(['favorites as is_favourited' => function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    }]);
                })
                ->limit(10)
                ->get();
        }

        return Inertia::render('Welcome', [
            'categories' => Category::select('id', 'name', 'image')->get(),
            'featured' => $featured,
            'products' => $products,
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId
            ]
        ]);
    }
}
