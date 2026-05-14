<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Food;
use App\Models\Order;
use App\Traits\FoodService;
use App\Models\UserPreference;
use App\Models\ChatMessage;
use App\Traits\BookingService;

class ChatController extends Controller
{
    use BookingService;
    use FoodService;

    public function chat(Request $request)
    {
        $request->validate([
            'messages' => 'required|array|min:1',
            'messages.*.role' => 'in:user,model',
            'messages.*.text' => 'required|string',
            'session_id' => 'required|exists:chat_sessions,id',
            'customer_id' => 'nullable|exists:customers,id',
        ]);

        $sessionId = $request->session_id;
        $userId = $request->customer_id;

        // ===== LẤY DỮ LIỆU CÁ NHÂN HÓA =====
        $liked = [];
        $disliked = [];
        $historyFoods = [];
        $historyText = 'Chưa có lịch sử món ăn.';
        $recommendText = 'Hiện tại chưa có món nào phù hợp.';

        if ($userId) {
            $pref = UserPreference::where('customer_id', $userId)->first();
            $liked = $pref?->liked_ingredients ?? [];
            $disliked = $pref?->disliked_ingredients ?? [];
            $historyFoods = $this->getCustomerHistoryFoods($userId);
            $historyText = !empty($historyFoods) ? implode(', ', $historyFoods) : 'Chưa có lịch sử món ăn.';
            $recommendedFoods = $this->suggestFoodsByPreference($userId);
            $recommendText = !empty($recommendedFoods)
                ? implode(', ', array_keys($recommendedFoods))
                : 'Hiện tại chưa có món nào phù hợp.';
        }

        $menu = Food::select('name', 'price')->get();
        $latestFoods = Food::latest()->take(5)->pluck('name')->toArray();
        $menuText = $menu->map(fn($item) => "{$item->name} ({$item->price}đ)")->implode(", ") . ".";
        $suggest = "Món mới: " . implode(", ", $latestFoods) . ".";

        // ===== PROMPT CHÍNH =====
        $rules = 'RULES
4. **Quy tắc đặt bàn & chọn món**:
- Nếu khách muốn đặt bàn + chọn món → kiểm tra các thông tin bắt buộc:
  1. customer_id = ' . $userId . '
  2. guest_count
  3. reservation_date
  4. reservation_time (tự động format về H:i:s)
  5. payment_method (cash,vnpay, nếu khách không trả lời thì mặc định là cash)
  6. total_price (nếu không có món nào thì là 0)
  7. voucher_id (nếu có)
  7. foods hoặc combos (có hoặc không)
- Nếu thiếu thông tin nào → KHÔNG trả JSON ngay, mà đặt câu hỏi ngắn gọn để lấy thông tin còn thiếu, nếu dữ liệu không có thì không cần đưa vào json.
- Khi đã đủ toàn bộ → trả JSON đúng cấu trúc:
{
  "type": "book_table",
  "data": { ...đầy đủ dữ liệu... }
}
- Nếu khách chỉ hỏi tư vấn → trả lời ngắn gọn, rõ ràng, tập trung ưu điểm nhà hàng & món phù hợp.';

        $intro = "Bạn tên là Kaisyn - chuyên gia tư vấn ẩm thực & tiếp thị cho nhà hàng Sushi Takami.

1. **Thông tin nhà hàng**:
- Phong cách: Sushi & ẩm thực Nhật truyền thống
- Vị trí: Quận 1, TP.HCM
- Ưu điểm: Đầu bếp Nhật chính gốc, nguyên liệu tươi nhập mỗi ngày, không gian truyền thống, dịch vụ chu đáo.

2. **Khẩu vị khách**:
- Món từng ăn: $historyText
- Nguyên liệu thích: " . implode(', ', $liked) . "
- Nguyên liệu không thích: " . implode(', ', $disliked) . "
- Gợi ý món hợp khẩu vị: $recommendText

3. **Menu nhà hàng**:
$menuText
$suggest
$rules

- Nếu khách chỉ hỏi tư vấn → trả lời ngắn gọn, rõ ràng, tập trung ưu điểm nhà hàng & món phù hợp.
";

        // ===== PROMPT PHÂN TÍCH SỞ THÍCH =====
        if ($userId) {
            $preferencePrompt = [[
                'role' => 'user',
                'content' => "Dựa vào cuộc hội thoại của người dùng phân tích sở thích của họ và trả về JSON:
{
  \"liked\": [\"...\"],
  \"disliked\": [\"...\"]
}
Chỉ cần JSON, không giải thích."
            ]];

            foreach ($request->messages as $msg) {
                $preferencePrompt[] = [
                    'role' => $msg['role'] === 'model' ? 'assistant' : 'user',
                    'content' => $msg['text']
                ];
            }
            $preferenceResponse = Http::withHeaders([
                'x-api-key' => env('CLAUDE_API_KEY'),
                'Content-Type' => 'application/json',
                'anthropic-version' => '2023-06-01',
            ])->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-3-5-sonnet-20241022',
                'max_tokens' => 512,
                'messages' => $preferencePrompt
            ]);

            if ($preferenceResponse->successful()) {
                $text = $preferenceResponse->json()['content'][0]['text'] ?? '';
                if (preg_match('/\{.*?\}/s', $text, $matches)) {
                    $preferences = json_decode($matches[0], true);
                    if (is_array($preferences)) {
                        $pref = UserPreference::firstOrCreate(['customer_id' => $userId]);
                        $updatedLikes = array_unique(array_merge($pref->liked_ingredients ?? [], $preferences['liked'] ?? []));
                        $updatedDislikes = array_unique(array_merge($pref->disliked_ingredients ?? [], $preferences['disliked'] ?? []));
                        $pref->update([
                            'liked_ingredients' => $updatedLikes,
                            'disliked_ingredients' => $updatedDislikes
                        ]);
                    }
                }
            }
        }

        // ===== PROMPT CHAT CHÍNH =====
        $chatPrompt = [['role' => 'user', 'content' => "$intro"]];
        foreach ($request->messages as $msg) {
            $chatPrompt[] = [
                "role" => $msg['role'] === 'model' ? 'assistant' : 'user',
                "content" => $msg['text']
            ];
        }

        $response = Http::withHeaders([
            'x-api-key' => env('CLAUDE_API_KEY'),
            'Content-Type' => 'application/json',
            'anthropic-version' => '2023-06-01',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => 'claude-3-5-sonnet-20241022',
            'max_tokens' => 1024,
            'messages' => $chatPrompt
        ]);

        $replyText = $response->successful()
            ? $response->json()['content'][0]['text'] ?? 'Xin lỗi, tôi không hiểu.'
            : 'Lỗi Claude: ' . $response->body();

        // ===== KIỂM TRA JSON ĐẶT BÀN =====
        if (preg_match('/\{.*\}/s', $replyText, $matches)) {
            $jsonData = json_decode($matches[0], true);

            if (is_array($jsonData) && ($jsonData['type'] ?? '') === 'book_table') {
                // Validate dữ liệu trước khi gọi OrderController
                $bookTableRequest = new Request($jsonData['data']);

                return $this->bookTables($bookTableRequest);
            }
        }

        // ===== LƯU TIN NHẮN =====
        ChatMessage::create([
            'chat_session_id' => $sessionId,
            'role' => "assistant",
            'text' => $replyText
        ]);

        return response()->json([
            'reply' => $replyText
        ]);
    }
}
