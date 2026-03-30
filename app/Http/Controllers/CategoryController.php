<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CategoryService;
use App\Models\Category;
use Illuminate\Support\Str;
// Import the Native SDK classes
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class CategoryController extends Controller
{
    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;

        // Setup Cloudinary Configuration once for the whole controller
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_KEY'),
                'api_secret' => env('CLOUDINARY_SECRET'),
            ],
            'url' => ['secure' => true]
        ]);
    }

    public function index()
    {
        return inertia('Admin/Categories/Index', [
            'categories' => $this->service->getAll()
        ]);
    }

    public function create()
    {
        return inertia('Admin/Categories/CategoryForm');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadToCloudinary($request->file('image'));
        }

        $this->service->create($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category successfully added.');
    }

    public function edit($id)
    {
        return inertia('Admin/Categories/CategoryForm', [
            'category' => $this->service->getById($id)
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // Cloudinary doesn't strictly require us to delete the old one
            // since we are storing the new URL, but it keeps things clean.
            $data['image'] = $this->uploadToCloudinary($request->file('image'));
        }

        $this->service->update($id, $data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return redirect()->back()->with('success', 'Category deleted.');
    }

    /**
     * Helper to handle Cloudinary Upload
     */
    protected function uploadToCloudinary($file)
    {
        $uploadApi = new UploadApi();
        $response = $uploadApi->upload($file->getRealPath(), [
            'folder' => 'categories',
        ]);

        return $response['secure_url'];
    }
}
