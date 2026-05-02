<?php
namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
protected $fillable = ['user_id', 'address_line', 'latitude', 'longitude', 'distance_km'];

public function user() {
return $this->belongsTo(User::class);
}
// App\Models\Address.php

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
}
