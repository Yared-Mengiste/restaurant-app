<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function getAll($search = null)
    {
        return Product::with(['category', 'variants'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'LIKE', "%$search%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%$search%");
                    });
            })
            ->latest()
            ->paginate(10);
    }

    public function getById($id)
    {
        return Product::with(['category', 'variants'])->findOrFail($id);
    }
    public function getByIdWithRelations($id)
    {
        return Product::with([
            'category:id,name',
            'variants:id,product_id,name,price'
        ])->findOrFail($id);
    }

    public function create($data)
    {
        return DB::transaction(function () use ($data) {
            // Create product without the 'variants' key to avoid SQL errors
            $product = Product::create(collect($data)->except('variants')->toArray());

        // Handle variants only if the product is set to have them
        if (($data['has_variants'] ?? false) && !empty($data['variants'])) {
            $product->variants()->createMany($data['variants']);
        }

        return $product->load('variants');
    });
    }

    public function update($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $product = Product::findOrFail($id);

            // Update product attributes, excluding variants to prevent 'Column not found' errors
            $product->update(collect($data)->except('variants')->toArray());

        // Sync variants: only if variants are provided in the request
        if (isset($data['variants'])) {
            // Standard 'Delete and Re-create' strategy
            $product->variants()->delete();

            // Only re-create if the product still supports variants
            if ($data['has_variants'] ?? $product->has_variants) {
                $product->variants()->createMany($data['variants']);
            }
        }

        return $product->load('variants');
    });
    }
    public function delete($id)
    {
        $product = Product::findOrFail($id);
        return $product->delete();
    }

    public function getRelatedProducts($categoryId, $excludeId)
    {
        return Product::where('category_id', $categoryId)
            ->where('id', '!=', $excludeId)
            ->where('is_available', true)
            ->latest()
            ->take(6)
            ->get();
    }
}
