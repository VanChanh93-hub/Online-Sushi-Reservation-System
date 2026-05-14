<?php

namespace App\Http\Controllers;

use App\Models\Combo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ComboController extends Controller
{

   public function index(Request $request)
    {
    $lang = $request->get('lang', 'vi');
    $combos = Combo::with('comboItems.food')->get();

    $localizedCombos = $combos->map(function ($combo) use ($lang) {
        $comboItems = $combo->comboItems->map(function ($item) use ($lang) {
            $food = $item->food;
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'food' => [
                    'id' => $food->id,
                    'name' => $lang === 'en' ? ($food->name_en ?? $food->name) : $food->name,
                    'name_en' => $food->name_en ?? '',
                    'jpName' => $food->jpName,
                    'description' => $lang === 'en' ? ($food->description_en ?? $food->description) : $food->description,
                    'description_en' => $food->description_en ?? '',
                    'price' => (float) $food->price, // luôn trả về giá gốc VND
                    'image' => $food->image ? asset('storage/' . $food->image) : null,
                    'average_rating' => round($food->averageRating(), 2), // ⭐ thêm rating của food trong combo
                ],
            ];
        });

        return [
            'id' => $combo->id,
            'name' => $lang === 'en' ? ($combo->name_en ?? $combo->name) : $combo->name,
            'name_en' => $combo->name_en ?? '',
            'description' => $lang === 'en' ? ($combo->description_en ?? $combo->description) : $combo->description,
            'description_en' => $combo->description_en ?? '',
            'price' => (float) $combo->price, // luôn trả về giá gốc VND
            'image' => $combo->image ? asset('storage/' . $combo->image) : null,
            'status' => $combo->status,
            'average_rating' => round($combo->averageRating(), 2),
            'combo_items' => $comboItems,
        ];
    });

    return response()->json(['data' => $localizedCombos]);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'food_items' => 'required|array',
            'food_items.*.food_id' => 'required|exists:foods,id',
            'food_items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($request->hasFile('image')) {$validated['image'] = $request->file('image')->store('combos', 'public');}

        $combo = Combo::create($validated);

        foreach ($validated['food_items'] as $item) {
            $combo->comboItems()->create([
                'food_id' => $item['food_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json(['message' => 'Combo created successfully.', 'data' => $combo->load('comboItems.food')], 201);
    }

    public function show(Request $request, $id)
    {
        $lang = $request->get('lang', 'vi');
        $combo = Combo::with('comboItems.food')->find($id);

        if (!$combo) {
            return response()->json(['message' => 'Combo not found.'], 404);
        }

        $comboItems = $combo->comboItems->map(function ($item) use ($lang) {
            $food = $item->food;
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'food' => [
                    'id' => $food->id,
                    'name' => $lang === 'en' ? ($food->name_en ?? $food->name) : $food->name,
                    'name_en' => $food->name_en ?? '',
                    'jpName' => $food->jpName,
                    'description' => $lang === 'en' ? ($food->description_en ?? $food->description) : $food->description,
                    'description_en' => $food->description_en ?? '',
                    'price' => (float) $food->price, // Luôn trả về giá gốc VND
                    'image' => $food->image ? asset('storage/' . $food->image) : null,
                ],
            ];
        });

        return response()->json([
            'id' => $combo->id,
            'name' => $lang === 'en' ? ($combo->name_en ?? $combo->name) : $combo->name,
            'name_en' => $combo->name_en ?? '',
            'description' => $lang === 'en' ? ($combo->description_en ?? $combo->description) : $combo->description,
            'description_en' => $combo->description_en ?? '',
            'price' => (float) $combo->price, // Luôn trả về giá gốc VND
            'image' => $combo->image ? asset('storage/' . $combo->image) : null,
            'status' => $combo->status,
            'combo_items' => $comboItems,
        ]);
    }

    public function update(Request $request, $id)
    {
        $combo = Combo::find($id);
        if (!$combo) {
            return response()->json(['message' => 'Combo not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'status' => 'sometimes|boolean',
            'food_items' => 'sometimes|array',
            'food_items.*.food_id' => 'required|exists:foods,id',
            'food_items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($request->hasFile('image')) {
            if ($combo->image) {
                Storage::disk('public')->delete($combo->image);
            }
            $validated['image'] = $request->file('image')->store('combos', 'public');
        }

        $combo->update($validated);

        if (isset($validated['food_items'])) {
            $combo->comboItems()->delete(); // Xóa các mục cũ
            foreach ($validated['food_items'] as $item) {
                $combo->comboItems()->create([
                    'food_id' => $item['food_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        return response()->json(['message' => 'Combo updated successfully.', 'data' => $combo->load('comboItems.food')]);
    }

    public function updateStatus(Request $request, $id)
    {
        $combo = Combo::find($id);
        if (!$combo) {
            return response()->json(['message' => 'Combo not found.'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|boolean',
        ]);

        $combo->status = $validated['status'];
        $combo->save();

        return response()->json(['message' => 'Combo status updated successfully.', 'data' => $combo->load('comboItems.food')]);
    }
}
