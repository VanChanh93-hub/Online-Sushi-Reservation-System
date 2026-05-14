<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ItemFeedback;
use App\Models\OrderItem;
use App\Models\Food;
use App\Models\Combo;
class ItemFeedbackController extends Controller
{

    public function index()
    {
    return response()->json(ItemFeedback::all());
    }
  public function store(Request $request, $orderItemId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $orderItem = OrderItem::findOrFail($orderItemId);

        // Nếu mỗi order_item chỉ có 1 feedback, dùng updateOrCreate
        $feedback = ItemFeedback::updateOrCreate(
            ['order_item_id' => $orderItem->id],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return response()->json([
            'message' => 'Feedback saved successfully',
            'data' => $feedback
        ]);
    }
     public function getFoodRating($id)
    {
        $food = Food::findOrFail($id);
        return response()->json([
            'food_id' => $food->id,
            'name' => $food->name,
            'average_rating' => round($food->averageRating(), 2),
        ]);
    }
     public function getComboRating($id)
    {
        $combo = Combo::findOrFail($id);
        return response()->json([
            'combo_id' => $combo->id,
            'name' => $combo->name,
            'average_rating' => round($combo->averageRating(), 2),
        ]);
    }
}
