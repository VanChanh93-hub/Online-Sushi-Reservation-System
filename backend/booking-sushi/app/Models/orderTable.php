<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderTable extends Model
{
    protected $table = 'order_tables';

    protected $fillable = [
        'order_id',
        'table_id',
        'reservation_date',
        'reservation_time',
        'status',
        'qr_token',
        'qr_expires_at',

    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }
}