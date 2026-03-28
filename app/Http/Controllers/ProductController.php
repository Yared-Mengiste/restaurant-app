<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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

        return inertia('Admin/Products', [
            'products' => $this->service->getAll($request->search),
            'filters' => [
                'search' => $request->search
            ]
        ]);
    }

    // GET /products/create
    public function create()
    {
        return inertia('Products/ProductForm', [
            'categories' => Category::orderBy('name')->get(['id', 'name'])
        ]);
    }

    public function edit($id)
    {
        return inertia('Products/ProductForm', [
            'product' => $this->service->getById($id)->load('variants'),
            'categories' => Category::orderBy('name')->get(['id', 'name'])
        ]);
    }


    // GET /products/{id}
    public function show($id)
    {
        $product = $this->service->getByIdWithRelations($id);

        $relatedProducts = $this->service->getRelatedProducts($product->category_id, $id);


        return inertia('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    // GET /products/{id}/edit


    // PUT /products/{id}
    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id'  => 'required|exists:categories,id',
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'is_featured'  => 'boolean',
            'has_variants' => 'boolean',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120', // Max 5MB [cite: 25]
            'variants'     => 'nullable|array',
            'variants.*.name'  => 'required_with:variants|string',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
        ]);

        // Handle Image Processing
        if ($request->hasFile('image')) {
            $data['image'] = $this->processImage($request->file('image'));
        }

        // Create product and handle variants via service
        $this->service->create($data);

        return redirect()
            ->route('admin.products')
            ->with('success', 'Culinary masterpiece added to the catalogue.');
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'category_id'  => 'sometimes|exists:categories,id',
            'name'         => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'sometimes|numeric|min:0',
            'is_available' => 'boolean',
            'is_featured'  => 'boolean',
            'has_variants' => 'boolean',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'variants'     => 'nullable|array',
            'variants.*.name'  => 'required_with:variants|string',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
        ]);

        // Handle Image Replacement
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image) {
                Storage::disk('public')->delete('products/' . $product->image);
            }
            $data['image'] = $this->processImage($request->file('image'));
        }

        $this->service->update($id, $data);

        return redirect()
            ->route('admin.products')
            ->with('success', 'Product details refined successfully.');
    }

    /**
     * Process, compress, and convert image to WEBP.
     * Stores in storage/app/public/products/
     */
    protected function processImage($file)
    {
        $filename = time() . '-' . Str::random(10) . '.webp';

        // 2. Initialize the Manager with a Driver (V3 Syntax)
        $manager = new ImageManager(new Driver());

        // 3. Read the image and chain the processing
        $image = $manager->read($file);

        // 4. Encode to WebP with compression
        $encoded = $image->toWebp(80); // 80 is the quality percentage

        // 5. Store using Laravel's Storage disk
        Storage::disk('public')->put('products/' . $filename, (string) $encoded);

        return $filename;
    }

    // DELETE /products/{id}
    public function destroy($id)
    {
        $this->service->delete($id);

        return redirect()
            ->back()
            ->with('success', 'Product deleted');
    }
    public function toggleAvailability(Product $product)
    {
        $product->update([
            'is_available' => !$product->is_available
        ]);

        return back()->with('success', $product->is_available ? 'Product is now live.' : 'Product hidden from menu.');
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
