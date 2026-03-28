<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_revenue' => Order::sum('total'),
            'today_orders' => Order::whereDate('created_at', today())->count(),
            'pending_deliveries' => Order::where('status', 'preparing')->count(),
            'revenue_growth' => 12.5,
        ];

        $orders = Order::query()
            ->with(['user', 'items', 'items.product'])
            // SEARCH FILTER
            ->when($request->search, function ($query, $search) {
                $query->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            // STATUS FILTER (New Logic)
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'orders' => $orders,
            // Pass 'status' back so the frontend knows which button is active
            'filters' => $request->only(['search', 'status'])
        ]);
    }

   public function updateStatus(Request $request, Order $order)
   {
       $request->validate([
           // Add 'delivering' and 'completed' to this list
           'status' => 'required|in:pending,confirmed,preparing,delivering,completed'
       ]);

       $order->update([
           'status' => $request->status
       ]);

       return back()->with('success', "Order #{$order->id} updated to {$request->status}.");
   }
}
