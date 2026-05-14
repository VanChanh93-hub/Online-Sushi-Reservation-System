<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $table = 'order_items';
    protected $fillable = [
        'order_id',
        'food_id',
        'combo_id',
        'quantity',
        'price',
        'status',
        'combo_id',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
        public function ItemFeedback()
        {
            return $this->hasOne(ItemFeedback::class, 'order_item_id');
        }
    public function feedback()
    {
        return $this->hasOne(ItemFeedback::class, 'order_item_id');
    }
    public function food(): BelongsTo
    {
        return $this->belongsTo(Food::class, 'food_id');
    }
    public function comboItem(): BelongsTo
    {
        return $this->belongsTo(Combo::class, 'combo_item_id');
    }
    public function combo()
    {
        return $this->belongsTo(\App\Models\Combo::class, 'combo_id');
    }
}
