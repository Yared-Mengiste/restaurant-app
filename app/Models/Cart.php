<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //
    protected $fillable = ['user_id', 'delivery_type', 'address_id'];
    public function items() {
        return $this->hasMany(CartItem::class);
    }
    // App\Models\Cart.php

    public function address()
    {
        return $this->belongsTo(Address::class);
    }
}
