<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //
    protected $fillable = ['user_id', 'delivery_type', 'address_id', 'phone', 'order_notes'];
    public function items() {
        return $this->hasMany(CartItem::class);
    }

    public function address() {
        return $this->belongsTo(Address::class);
    }
}
