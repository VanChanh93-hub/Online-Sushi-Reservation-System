<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodGroup extends Model
{
    protected $table = 'food_groups';
    protected $fillable = [
       'category_id',
       'status',
       'name',
        'name_en',
    ];

    public function food()
    {
        // Sửa lại khóa ngoại thành 'group_id'
        return $this->hasMany(Food::class, 'group_id');
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
