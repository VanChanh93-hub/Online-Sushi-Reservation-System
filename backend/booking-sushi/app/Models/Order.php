<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'payment_method',
        'voucher_id',
        'total_price',
        'status',
        'payment_status',
        'payment_code',
        'note',
    ];


    // Một order có thể có nhiều bàn (qua bảng trung gian order_tables)
    public function tables()
    {
        return $this->belongsToMany(Table::class, 'order_tables', 'order_id', 'table_id')
            ->withPivot(['reservation_date', 'reservation_time'])
            ->withTimestamps();
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
    public function orderTables()
    {
        return $this->hasMany(\App\Models\OrderTable::class, 'order_id');
    }
}
