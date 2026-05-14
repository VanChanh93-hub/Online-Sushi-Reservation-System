<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Syncable;

class Category extends Model
{
    use Syncable;

    protected $table = 'categories';
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'description', 'status', 'name_en'];

    public function foods()
    {
        return $this->hasMany(Food::class);
    }
}
