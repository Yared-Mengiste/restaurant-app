<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'is_available',
        'image',
        'has_variants',
        'is_featured'
    ];

    public function variants() {
        return $this->hasMany(ProductVariant::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }
    // App\Models\Product.php

    public function favorites()
    {
        return $this->hasMany(Favorites::class);
    }
}
