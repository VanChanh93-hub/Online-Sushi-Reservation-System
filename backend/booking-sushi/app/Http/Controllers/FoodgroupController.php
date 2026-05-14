<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FoodGroup;

class FoodgroupController extends Controller
{
    // Lấy danh sách nhóm món ăn
    public function index(Request $request){
        $lang = $request->get('lang', 'vi'); // Lấy tham số ngôn ngữ
        $groups = FoodGroup::with('category')->get();

        $localizedGroups = $groups->map(function ($group) use ($lang) {
            return [
                'id' => $group->id,
                'category_id' => $group->category_id,
                'name' => $lang === 'en' ? ($group->name_en ?? $group->name) : $group->name,
                'name_en' => $group->name_en ?? '', // Đảm bảo luôn có trường này
                'status' => $group->status,
                'created_at' => $group->created_at,
                'updated_at' => $group->updated_at,
                'category' => $group->category,
            ];
        });

        return response()->json($localizedGroups);
    }

    // Tạo mới nhóm món ăn
    public function store(Request $request){
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255', // Thêm name_en
        ]);
        $group = FoodGroup::create($validated);
        return response()->json($group, 201);
    }

    // Lấy chi tiết nhóm món ăn
    public function show(Request $request, $id){
        $lang = $request->get('lang', 'vi'); // Lấy tham số ngôn ngữ
        $group = FoodGroup::with('category', 'food')->find($id);

        if (!$group) {
            return response()->json(['message' => 'Không tìm thấy nhóm món ăn'], 404);
        }

        // Áp dụng logic dịch cho tên nhóm khi trả về chi tiết
        $group->name = $lang === 'en' ? ($group->name_en ?? $group->name) : $group->name;
        $group->name_en = $group->name_en ?? ''; // Đảm bảo luôn có trường này

        return response()->json($group);
    }

    // Cập nhật nhóm món ăn
    public function update(Request $request, $id){
        $group = FoodGroup::find($id);
        if (!$group) {
            return response()->json(['message' => 'Không tìm thấy nhóm món ăn'], 404);
        }
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'name_en' => 'nullable|string|max:255', // Thêm name_en
        ]);
        $group->update($validated);
        return response()->json($group);
    }

    public function updateStatus(Request $request, $id){
        $group = FoodGroup::find($id);
        if (!$group) {
            return response()->json(['message' => 'Không tìm thấy nhóm món ăn'], 404);
        }
$validated = $request->validate([
            'status' => 'required|boolean',
        ]);
        $group->update($validated);
        return response()->json($group);
    }
}
