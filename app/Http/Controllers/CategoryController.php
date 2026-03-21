<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return inertia('Categories/Index', [
            'categories' => $this->service->getAll()
        ]);
    }

    public function create()
    {
        return inertia('Categories/Create');
    }

//    public function store(Request $request)
//    {
//        $data = $request->validate([
//            'name' => 'required|string',
//            'image' => 'nullable|string'
//        ]);
//
//        $this->service->create($data);
//
//        return redirect()->route('categories.index')
//            ->with('success', 'Category created');
//    }
//
//    public function edit($id)
//    {
//        return inertia('Categories/Edit', [
//            'category' => $this->service->getById($id)
//        ]);
//    }
//
//    public function update(Request $request, $id)
//    {
//        $this->service->update($id, $request->all());
//
//        return redirect()->route('categories.index')
//            ->with('success', 'Updated');
//    }
//
//    public function destroy($id)
//    {
//        $this->service->delete($id);
//
//        return redirect()->back()->with('success', 'Deleted');
//    }
}
//
//namespace App\Http\Controllers;
//
//use Illuminate\Http\Request;
//use App\Services\CategoryService;
//
//class CategoryController extends Controller
//{
//    protected $service;
//
//    public function __construct(CategoryService $service)
//    {
//        $this->service = $service;
//    }
//
//    public function index()
//    {
//        return response()->json(
//            $this->service->getAll()
//        );
//    }
//
//    public function show($id)
//    {
//        return response()->json(
//            $this->service->getById($id)
//        );
//    }
//
//    public function store(Request $request)
//    {
//        $data = $request->validate([
//            'name' => 'required|string',
//            'image' => 'nullable|string'
//        ]);
//
//        return response()->json(
//            $this->service->create($data),
//            201
//        );
//    }
//
//    public function update(Request $request, $id)
//    {
//        return response()->json(
//            $this->service->update($id, $request->all())
//        );
//    }
//
//    public function destroy($id)
//    {
//        $this->service->delete($id);
//
//        return response()->json(['message' => 'Deleted']);
//    }
//}
