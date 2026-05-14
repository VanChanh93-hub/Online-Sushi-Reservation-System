<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\Order;


class FeedbackController extends Controller
{
    // Lấy toàn bộ feedback
    public function index()
    {
        return response()->json(Feedback::all());
    }

    // Thêm feedback cho 1 order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating'   => 'required|integer|min:1|max:5',
            'comment'  => 'nullable|string',
        ]);

        // Chỉ cho phép feedback khi order success
        $order = Order::find($validated['order_id']);
        if (!$order || $order->status !== 'success') {
            return response()->json(['message' => 'Chỉ có thể đánh giá đơn hàng đã hoàn thành (success)'], 403);
        }

        // Kiểm tra đã có feedback chưa
        $existingFeedback = Feedback::where('order_id', $validated['order_id'])->first();
        if ($existingFeedback) {
            return response()->json(['message' => 'Đơn hàng này đã có feedback rồi'], 422);
        }

        $feedback = Feedback::create($validated);

        return response()->json([
            'message' => 'Gửi đánh giá thành công',
            'data'    => $feedback,
        ], 201);
    }

    // Lấy feedback theo order_id
    public function getFeedbackByOrderId($orderId)
    {
        $feedback = Feedback::where('order_id', $orderId)->first();
        if (!$feedback) {
            return response()->json(['message' => 'Không có feedback cho đơn hàng này'], 404);
        }

        return response()->json([
            'message' => 'Feedback của đơn hàng',
            'data'    => $feedback
        ]);
    }

    // Admin trả lời feedback
    public function adminReply(Request $request, $feedbackId)
    {
        $request->validate([
            'admin_reply' => 'required|string',
        ]);

        $feedback = Feedback::find($feedbackId);
        if (!$feedback) {
            return response()->json(['message' => 'Feedback không tồn tại'], 404);
        }

        $feedback->admin_reply = $request->input('admin_reply');
        $feedback->save();

        return response()->json([
            'message' => 'Admin đã trả lời feedback thành công',
            'data'    => $feedback
        ]);
    }

    public function show($orderId)
{
    $order = Order::with([
        'feedback',
        'items.feedback',
        'items.food'
    ])->findOrFail($orderId);

    $data = [
        'order_id' => $order->id,
        'feedback_order' => $order->feedback,
        'feedback_items' => $order->items->map(function ($item) {
            return [
                'order_item_id' => $item->id,
                'food_id' => $item->food->id ?? null,
                'food_name' => $item->food->name ?? null,
                'combo_id' => $item->combo->id ?? null,
                'combo_name' => $item->combo->name ?? null,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'Itemfeedback' => $item->feedback,
            ];
        })
    ];

    return response()->json($data);
}
public function getAllOrdersWithFeedback()
{
    $orders = Order::with([
        'feedback',
        'items.feedback',
        'items.food'
    ])->get();

    $data = $orders->map(function ($order) {
        return [
            'order_id'       => $order->id,
            'status'         => $order->status,
            'total_price'    => $order->total_price,
            'feedback_order' => $order->feedback,
            'feedback_items' => $order->items->map(function ($item) {
                return [
                    'order_item_id' => $item->id,
                    'food_id'       => $item->food->id ?? null,
                    'food_name'     => $item->food->name ?? null,
                    'feedback'      => $item->feedback
                ];
            })
        ];
    });

    return response()->json($data);
}
        // get orderitem from order
        public function getorderitem($orderId)
        {
            $order = Order::with('items')->findOrFail($orderId);
            $data = $order->items->map(function ($item) {
                return [
                    'id'          => $item->id,
                    'order_id'   => $item->order_id,
                    'food_id'       => $item->food->id ?? null,
                    'food_name'     => $item->food->name ?? null,
                    'combo_id'    => $item->combo->id ?? null,
                    'combo_name'  => $item->combo->name ?? null,
                    'quantity'      => $item->quantity,
                    'price'        => $item->price,
                ];
            });
            return response()->json($data);
        }

}
