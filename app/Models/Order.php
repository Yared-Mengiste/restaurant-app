<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class Order extends Model
{
protected $fillable = [
'user_id',
'address_id',
'delivery_type',
'subtotal',
'delivery_fee',
'total',
'status',
'payment_status'
];

public function user() {
return $this->belongsTo(User::class);
}

public function address() {
return $this->belongsTo(Address::class);
}
}
