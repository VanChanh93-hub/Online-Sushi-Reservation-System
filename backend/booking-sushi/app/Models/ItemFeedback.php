<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemFeedback extends Model
{
    protected $fillable = ['order_item_id', 'rating', 'comment'];
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }
}
