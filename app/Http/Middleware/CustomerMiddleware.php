<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // If the user is logged in but is an ADMIN, block them from customer-only pages
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard'); // Send them back to their territory
        }

        return $next($request);
    }
}
