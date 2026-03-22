<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProductService;

class ProductController extends Controller
{
    protected $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    // GET /products
    public function index(Request $request)
    {

        return inertia('Products/Index', [
            'products' => $this->service->getAll($request->search),
            'filters' => [
                'search' => $request->search
            ]
        ]);
    }

    // GET /products/create
    public function create()
    {
        return inertia('Products/Create');
    }

    // POST /products
    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'has_variants' => 'boolean',
            'is_featured' => 'boolean',
            'is_available' => 'boolean',
            'image' => 'nullable|string',

            'variants' => 'array',
            'variants.*.name' => 'required|string',
            'variants.*.price' => 'required|numeric'
        ]);

        $this->service->create($data);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully');
    }

    // GET /products/{id}
    public function show($id)
    {
        $product = $this->service->getByIdWithRelations($id);

        $relatedProducts = $this->service->getRelatedProducts($product->category_id, $id);

        $cartSummary = app(\App\Services\CartService::class)->getSummary();

        return inertia('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'cart' => $cartSummary,
        ]);
    }

    // GET /products/{id}/edit
    public function edit($id)
    {
        return inertia('Products/Edit', [
            'product' => $this->service->getById($id)
        ]);
    }

    // PUT /products/{id}
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'has_variants' => 'boolean',
            'is_featured' => 'boolean',
            'is_available' => 'boolean',
            'image' => 'nullable|string',

            'variants' => 'array',
            'variants.*.name' => 'required|string',
            'variants.*.price' => 'required|numeric'
        ]);

        $this->service->update($id, $data);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product updated');
    }

    // DELETE /products/{id}
    public function destroy($id)
    {
        $this->service->delete($id);

        return redirect()
            ->back()
            ->with('success', 'Product deleted');
    }
}
//
//namespace App\Http\Controllers;
//
//use Illuminate\Http\Request;
//use App\Services\ProductService;
//
//class ProductController extends Controller
//{
//    protected $service;
//
//    public function __construct(ProductService $service)
//    {
//        $this->service = $service;
//    }
//
//    // GET /products?search=burger
//    public function index(Request $request)
//    {
//        $products = $this->service->getAll($request->search);
//
//        return response()->json($products);
//    }
//
//    // GET /products/{id}
//    public function show($id)
//    {
//        return response()->json(
//            $this->service->getById($id)
//        );
//    }
//
//    // POST /products
//    public function store(Request $request)
//    {
//        $data = $request->validate([
//            'category_id' => 'required|exists:categories,id',
//            'name' => 'required|string',
//            'description' => 'nullable|string',
//            'price' => 'required|numeric',
//            'has_variants' => 'boolean',
//            'is_featured' => 'boolean',
//            'is_available' => 'boolean',
//            'image' => 'nullable|string',
//
//            'variants' => 'array',
//            'variants.*.name' => 'required|string',
//            'variants.*.price' => 'required|numeric'
//        ]);
//
//        return response()->json(
//            $this->service->create($data),
//            201
//        );
//    }
//
//    // PUT /products/{id}
//    public function update(Request $request, $id)
//    {
//        $data = $request->validate([
//            'category_id' => 'sometimes|exists:categories,id',
//            'name' => 'sometimes|string',
//            'description' => 'nullable|string',
//            'price' => 'sometimes|numeric',
//            'has_variants' => 'boolean',
//            'is_featured' => 'boolean',
//            'is_available' => 'boolean',
//            'image' => 'nullable|string',
//
//            'variants' => 'array',
//            'variants.*.name' => 'required|string',
//            'variants.*.price' => 'required|numeric'
//        ]);
//
//        return response()->json(
//            $this->service->update($id, $data)
//        );
//    }
//
//    // DELETE /products/{id}
//    public function destroy($id)
//    {
//        $this->service->delete($id);
//
//        return response()->json(['message' => 'Deleted']);
//    }
//}
