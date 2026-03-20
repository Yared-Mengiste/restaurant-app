<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class OrderItem extends Model
{
protected $fillable = ['order_id', 'product_id', 'quantity', 'product_variant_id', 'price'];

public function product() {
return $this->belongsTo(Product::class);
}

public function order() {
return $this->belongsTo(Order::class);
}

public function variant() {
        return $this->belongsTo(ProductVariant::class);
    }
}
