<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CategoryService;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CategoryController extends Controller
{
protected $service;

public function __construct(CategoryService $service)
{
$this->service = $service;
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
'name' => 'required|string|max:255',
'description' => 'nullable|string',
'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
]);

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')
            ->storeOnCloudinary('categories')
            ->getSecurePath();
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
'name' => 'required|string|max:255',
'description' => 'nullable|string',
'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
]);

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')
            ->storeOnCloudinary('categories')
            ->getSecurePath();
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

protected function processImage($file)
{
$filename = time() . '-' . Str::random(10) . '.webp';
$manager = new ImageManager(new Driver());
$image = $manager->read($file);
$encoded = $image->toWebp(80);
Storage::disk('public')->put('categories/' . $filename, (string) $encoded);
return $filename;
}
}
