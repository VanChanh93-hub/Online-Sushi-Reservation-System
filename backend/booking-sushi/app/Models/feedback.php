<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use App\Models\Order;
class feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = [
        'order_id',
        'rating',
        'comment',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
