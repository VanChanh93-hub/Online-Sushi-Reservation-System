<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Combo extends Model
{

    protected $fillable = [
        'name',
        'name_en',
        'price',
        'image',
        'description',
        'description_en',
        'status',
    ];
      public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function comboitems()
    {
        return $this->hasMany(ComboItem::class);
    }
    public function feedbacks()
    {
        return $this->hasManyThrough(
            ItemFeedback::class,
            OrderItem::class,
            'combo_id',       // foreign key ở order_items
            'order_item_id',  // foreign key ở item_feedback
            'id',             // local key ở combos
            'id'              // local key ở order_items
        );
    }

    public function averageRating()
    {
        return $this->feedbacks()->avg('rating') ?? 0;
    }
}
