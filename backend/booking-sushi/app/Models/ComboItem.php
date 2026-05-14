<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComboItem extends Model
{
    protected $table = 'combo_items';

    protected $fillable = [
        'combo_id',
        'food_id',
        'quantity',
    ];

    public function combo()
    {
        return $this->belongsTo(Combo::class, 'combo_id');
    }

    public function food()
    {
        return $this->belongsTo(Food::class, 'food_id');
    }
}
