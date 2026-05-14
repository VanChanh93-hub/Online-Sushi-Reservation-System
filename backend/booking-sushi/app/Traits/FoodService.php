<?php

namespace App\Traits;

use App\Models\Food;
use App\Models\UserPreference;

trait FoodService
{
    public function getCustomerHistoryFoods($customerId)
    {
        return Food::join('order_items', 'order_items.food_id', '=', 'foods.id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.customer_id', $customerId)
            ->distinct()
            ->pluck('foods.name')
            ->unique()
            ->toArray();
    }

    public function getBestSellerFoods($limit = 5)
    {
        return Food::join('order_items', 'order_items.food_id', '=', 'foods.id')
            ->groupBy('order_items.food_id', 'foods.name', 'foods.price')
            ->orderByRaw('SUM(order_items.quantity) DESC')
            ->limit($limit)
            ->get()
            ->pluck('price', 'name')  // ['Tên món' => 'Giá']
            ->toArray();
    }

    public function suggestFoodsByPreference($customerId, $limit = 5)
    {
        $prefs = UserPreference::where('customer_id', $customerId)->first();
        if (!$prefs) return [];

        $liked = is_string($prefs->liked_ingredients)
            ? json_decode($prefs->liked_ingredients, true)
            : $prefs->liked_ingredients;

        $disliked = is_string($prefs->disliked_ingredients)
            ? json_decode($prefs->disliked_ingredients, true)
            : $prefs->disliked_ingredients;

        $query = Food::query();

        if (!empty($liked)) {
            $query->where(function ($q) use ($liked) {
                foreach ($liked as $ingredient) {
                    $q->orWhere('name', 'LIKE', '%' . $ingredient . '%');
                }
            });
        }

        if (!empty($disliked)) {
            foreach ($disliked as $ingredient) {
                $query->where('name', 'NOT LIKE', '%' . $ingredient . '%');
            }
        }

        return $query->limit($limit)->get()
            ->pluck('price', 'name')  // ['Tên món' => 'Giá']
            ->toArray();
    }
}