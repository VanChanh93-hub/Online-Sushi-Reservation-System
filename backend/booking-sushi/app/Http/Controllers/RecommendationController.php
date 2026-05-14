<?php
// app/Http/Controllers/RecommendationController.php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Food;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function get($customerId)
    {
        $check = Order::where('customer_id', $customerId)
            ->with("customer")
            ->latest()
            ->first();
        if (!$check) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng cho khách hàng này.'], 404);
        }
        $allFoods = Food::all()->pluck('name')->toArray();
        $history = OrderItem::where('order_id', $check->id)
            ->with('food')
            ->latest()
            ->take(10)
            ->get()
            ->pluck('food.name')
            ->toArray();
        if (empty($history)) {
            $newFoods = Food::orderBy('created_at', 'desc')->take(5)->pluck('name')->toArray();
            $topFoods = Food::orderBy('price', 'desc')->take(5)->pluck('name')->toArray();
            $prompt = "khách hàng tên" . $check->customer->name  . ".
            Bạn là một chuyên gia ẩm thực Nhật Bản tại một nhà hàng sushi cao cấp.  
            Dưới đây là những món sushi mới ra mắt gần đây: " . implode(", ", $newFoods) . ".
            Và đây là những món sushi được yêu thích và bán chạy nhất: " . implode(", ", $topFoods) . ".
            Gợi ý 3 món sushi hấp dẫn cho khách hàng mới. Mỗi món gồm:
-           Tên món
-            Mô tả ngắn về hương vị và thành phần
            Lưu ý:
            - Gợi ý phải đa dạng về nguyên liệu và hương vị.
            - Ưu tiên các món có trải nghiệm ẩm thực độc đáo, dễ nhớ.";
        } else {
            $prompt = " khách hàng tên" . $check->customer->name  . ".
            Bạn là một chuyên gia ẩm thực Nhật Bản tại một nhà hàng sushi cao cấp.
            Món đã từng gọi: "
                . implode(", ", $history) . ".
            Thực đơn nhà hàng "
                . implode(", ", $allFoods) . ".
            Gợi ý 3 món KHÁC BIỆT với món đã ăn. Mỗi món gồm:
            - Tên món
            - Mô tả ngắn (1 dòng) về hương vị và thành phần
            Lưu ý:
            - Không trùng món cũ
            - Đa dạng, nổi bật, hợp gu khách";
        }
        $response = Http::post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . env('GEMINI_API_KEY'), [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);
        $result = $response->json();
        $recommend = $result['candidates'][0]['content']['parts'][0]['text'];
        return response()->json([
            'recommendations' => $recommend,
        ]);
    }
    public function tasteProfile($customerId)
    {
        $order = Order::where('customer_id', $customerId)->with('customer')->latest()->first();

        if (!$order) {
            return response()->json(['message' => 'Khách hàng chưa có đơn hàng.'], 404);
        }

        $customerName = $order->customer->name;
        $history = OrderItem::where('order_id', $order->id)
            ->with('food')
            ->latest()
            ->take(10)
            ->get()
            ->pluck('food.name')
            ->toArray();

        if (empty($history)) {
            return response()->json(['message' => 'Không có lịch sử món ăn để phân tích.'], 404);
        }

        $menu = Food::pluck('name')->toArray();

        $prompt = "Bạn là một chuyên gia ẩm thực Nhật Bản tại một nhà hàng sushi cao cấp.

    Khách hàng tên: {$customerName}
    Danh sách món khách đã từng gọi: " . implode(", ", $history) . ".
    Thực đơn hiện tại của nhà hàng: " . implode(", ", $menu) . ".

    Hãy phân tích và mô tả khẩu vị của khách hàng dựa trên các món này. 
    Tập trung vào các yếu tố như:
    - Loại nguyên liệu (cá sống, hải sản, trứng, rau củ, v.v.)
    - Phong cách món (sashimi, sushi cuộn, tempura, nướng, v.v.)
    - Hương vị chính (thanh mát, béo ngậy, đậm đà, cay nhẹ, giòn, v.v.)

    Trình bày kết luận rõ ràng trong 3–5 dòng, mô tả cụ thể khẩu vị ưu thích của khách.
    Không cần gợi ý món mới, chỉ tập trung phân tích sở thích ẩm thực sushi của khách dựa trên hành vi gọi món trước đó.";

        $response = Http::post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . env('GEMINI_API_KEY'), [
            'contents' => [['parts' => [['text' => $prompt]]]]
        ]);

        $result = $response->json();

        return response()->json([
            'recommendations' => $result['candidates'][0]['content']['parts'][0]['text']

        ]);
    }
}