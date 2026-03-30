<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Str;
// Import Native Cloudinary SDK
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class ProductController extends Controller
{
    protected $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;

        // Centralized Cloudinary Config
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_KEY'),
                'api_secret' => env('CLOUDINARY_SECRET'),
            ],
            'url' => ['secure' => true]
        ]);
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

    public function show($id)
    {
        $product = $this->service->getByIdWithRelations($id);
        $relatedProducts = $this->service->getRelatedProducts($product->category_id, $id);

        return inertia('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function adminShow($id)
    {
        $product = $this->service->getByIdWithRelations($id);
        $relatedProducts = $this->service->getRelatedProducts($product->category_id, $id);

        return inertia('Admin/ProductShow', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'stats' => [
                'total_orders' => $product->orders_count ?? 0,
                'last_updated' => $product->updated_at?->diffForHumans() ?? 'Never',
            ]
        ]);
    }

    // POST /admin/products
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
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'variants'     => 'nullable|array',
            'variants.*.name'  => 'required_with:variants|string',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadToCloudinary($request->file('image'));
        }

        $this->service->create($data);

        return redirect()
            ->route('admin.products')
            ->with('success', 'Culinary masterpiece added to the catalogue.');
    }

    // PUT /admin/products/{id}
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

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadToCloudinary($request->file('image'));
        }

        $this->service->update($id, $data);

        return redirect()
            ->route('admin.products')
            ->with('success', 'Product details refined successfully.');
    }

    /**
     * Helper Method: Upload to Cloudinary
     */
    protected function uploadToCloudinary($file)
    {
        $uploadApi = new UploadApi();
        $response = $uploadApi->upload($file->getRealPath(), [
            'folder' => 'products',
        ]);

        return $response['secure_url'];
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return redirect()->back()->with('success', 'Product deleted');
    }

    public function toggleAvailability(Product $product)
    {
        $product->update([
            'is_available' => !$product->is_available
        ]);

        return back()->with('success', $product->is_available ? 'Product is live.' : 'Product hidden.');
    }

    public function toggleFavorite(Product $product)
    {
        $user = auth()->user();

        if ($user->favorites()->where('product_id', $product->id)->exists()) {
            $user->favorites()->detach($product->id);
            return back()->with('message', 'Removed from favorites');
        }

        $user->favorites()->attach($product->id);
        return back()->with('message', 'Added to favorites');
    }
}
