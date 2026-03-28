<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 80/20 Rule: Focus on core metrics first
        $stats = [
            'total_revenue' => Order::sum('total'),
//            'total_revenue' => Order::where('status', 'delivered')->sum('total'),
            'today_orders' => Order::whereDate('created_at', today())->count(),
            'pending_deliveries' => Order::where('status', 'preparing')->count(),
            'revenue_growth' => 12.5, // Logic for growth comparison could be added here
        ];

        $orders = Order::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'orders' => $orders,
            'filters' => $request->only(['search'])
        ]);
    }
}
