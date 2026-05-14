<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->query('lang', 'vi');

        $categories = Category::all()->map(function ($category) use ($lang) {
            return [
                'id' => $category->id,
                'name' => $lang === 'en' ? $category->name_en ?? $category->name : $category->name,
                'name_en' => $category->name_en,
                'description' => $category->description,
                'icon' => $category->icon ?? null,
                'status' => $category->status,
            ];
        });

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'name_en' => 'nullable|string|max:255|unique:categories,name_en',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => $category
        ], 201);
    }

    public function show($id, Request $request)
    {
        $category = Category::find($id);
        $lang = $request->query('lang', 'vi');

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        $translatedCategory = [
            'id' => $category->id,
            'name' => $lang === 'en' ? $category->name_en ?? $category->name : $category->name,
            'description' => $category->description,
            'name_en' => $category->name_en,
            'icon' => $category->icon ?? null,
            'status' => $category->status,
        ];

        return response()->json($translatedCategory);
    }

    public function updateStatus(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|boolean',
        ]);

        $category->status = $validated['status'];
        $category->save();

        return response()->json([
            'message' => 'Category status updated successfully.',
            'data' => $category
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $id,
            'name_en' => 'nullable|string|max:255|unique:categories,name_en,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);
        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => $category
        ]);
    }
}
