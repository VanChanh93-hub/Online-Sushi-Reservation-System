<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['customer_id', 'liked_ingredients', 'disliked_ingredients'];

    protected $casts = [
        'liked_ingredients' => 'array',
        'disliked_ingredients' => 'array',
    ];
}