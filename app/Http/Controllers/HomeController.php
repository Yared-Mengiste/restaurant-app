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
        // 80/20: Grab only what we need for the initial render
        $search = $request->input('search');
        $categoryId = $request->input('category_id');

        // Query for the main menu grid
        $products = Product::query()
            ->with(['category']) // Eager load to prevent N+1 issues
            ->where('is_available', true)
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($categoryId, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->latest()
            ->get();

        return Inertia::render('Welcome', [
            // Only fetch what's needed for the CategoryCard props
            'categories' => Category::select('id', 'name', 'image')->get(),

            // Chef's Choice section (Only show if not searching/filtering for cleaner UI)
            'featured' => (!$search && !$categoryId)
                ? Product::where('is_featured', true)->where('is_available', true)->limit(10)->get()
                : [],

            'products' => $products,

            // Return filters so the frontend can bind the search input/active category state
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId
            ]
        ]);
    }
}
