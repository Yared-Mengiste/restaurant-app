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

    public function create($data)
    {
        return DB::transaction(function () use ($data) {

            $product = Product::create([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'has_variants' => $data['has_variants'] ?? false,
                'is_featured' => $data['is_featured'] ?? false,
                'is_available' => $data['is_available'] ?? true,
                'image' => $data['image'] ?? null,
            ]);

            // Handle variants
            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variant) {
                    $product->variants()->create($variant);
                }
            }

            return $product->load('variants');
        });
    }

    public function update($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {

            $product = Product::findOrFail($id);

            $product->update($data);

            // Replace variants if provided
            if (isset($data['variants'])) {
                $product->variants()->delete();

                foreach ($data['variants'] as $variant) {
                    $product->variants()->create($variant);
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
}
