<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerVoucher extends Model
{
    protected $table = 'customer_vouchers';

    protected $fillable = [
        'customer_id',
        'voucher_id',
        'status',
        'used_at',
        'assigned_at',
        'date',

    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
