<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{

    public function history(Request $request)
    {
        $orders = $request->user()->orders()
            ->with(['items.product', 'items.variant'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Profile/OrderHistory', [
            'orders' => $orders,
        ]);
    }
    //
}
