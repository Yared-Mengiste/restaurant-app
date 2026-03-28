import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment } from 'react';

export default function Dashboard({ auth, stats, orders, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const isFirstRender = useRef(true);

    // DEBOUNCED SEARCH LOGIC
    useEffect(() => {
        // Skip the first render so we don't reload the page immediately
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('admin.dashboard'),
                { search: search },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true
                }
            );
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <AdminLayout>
            <Head title="Maitre D' Overview" />

            {/* Dashboard Header & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-headline text-5xl font-light text-on-surface tracking-tight mb-2">
                        Maitre D' <span className="text-primary italic">Overview</span>
                    </h1>
                    <p className="font-body text-on-surface-variant max-w-md">
                        Orchestrating the evening's flow. Your digital command center for excellence.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest transition-all font-label text-xs uppercase font-bold tracking-widest">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Product
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-highest text-primary font-label text-xs uppercase font-bold tracking-widest hover:bg-surface-container-high transition-all">
                        <span className="material-symbols-outlined text-sm">grid_view</span>
                        Categories
                    </button>
                </div>
            </div>

            {/* Stats Overview Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    label="Total Revenue"
                    value={`$${Number(stats.total_revenue).toLocaleString()}`}
                    growth={`${stats.revenue_growth}%`}
                    icon="payments"
                    color="primary"
                />
                <StatCard
                    label="Today's Orders"
                    value={stats.today_orders}
                    subtext="Live"
                    icon="restaurant_menu"
                    color="tertiary"
                />
                <StatCard
                    label="Pending Deliveries"
                    value={stats.pending_deliveries}
                    pulse={stats.pending_deliveries > 0}
                    icon="pending_actions"
                    color="error"
                />
            </div>

            {/* Orders Management Section */}
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden shadow-2xl">
                {/* Filter & Search Bar */}
                <div className="px-8 py-6 border-b border-outline-variant/10 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="relative w-full lg:w-96">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search orders, customers..."
                            className="w-full bg-surface-container-highest border-none rounded-full py-3 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary/50 font-body text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label text-[10px] uppercase font-bold tracking-widest shrink-0">All Orders</button>
                        <button className="bg-surface-container-highest text-on-surface-variant px-6 py-2 rounded-full font-label text-[10px] uppercase font-bold tracking-widest hover:text-white transition-all shrink-0">Preparing</button>
                        <button className="bg-surface-container-highest text-on-surface-variant px-6 py-2 rounded-full font-label text-[10px] uppercase font-bold tracking-widest hover:text-white transition-all shrink-0">Confirmed</button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-surface-container-high/30">
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">Order ID</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">Customer</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">Date</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">Type</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">Total</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">Status</th>
                            <th className="px-8 py-5 border-b border-outline-variant/10"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                        {orders.data.map((order) => (
                            <tr key={order.id} className="hover:bg-surface-container-high/20 transition-colors group">
                                <td className="px-8 py-6 font-mono text-xs text-primary">#{order.order_number || order.id}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                                            {order.user.name.charAt(0)}
                                        </div>
                                        <span className="font-headline text-sm tracking-wide text-on-surface">{order.user.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-extrabold uppercase tracking-widest`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-tertiary`}></span>
                                            {order.delivery_type}
                                        </span>
                                </td>
                                <td className="px-8 py-6 font-bold text-on-surface">${order.total}</td>
                                <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-extrabold uppercase tracking-widest`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'preparing' ? 'bg-primary animate-pulse' : 'bg-tertiary'}`}></span>
                                            {order.status}
                                        </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-between items-center">
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                        Showing {orders.from} to {orders.to} of {orders.total} orders
                    </p>
                    <div className="flex gap-2">
                        {orders.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all text-[10px] font-bold
                                    ${link.active ? 'border-primary text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary'}
                                    ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}
                                `}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, growth, subtext, icon, color, pulse }) {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        tertiary: 'bg-tertiary/10 text-tertiary',
        error: 'bg-error/10 text-error'
    };

    return (
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 group hover:border-primary/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {growth && <span className="text-primary text-xs font-bold">{growth}</span>}
                {subtext && <span className="text-tertiary text-xs font-bold">{subtext}</span>}
                {pulse && <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>}
            </div>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">{label}</p>
            <h3 className="font-headline text-4xl text-on-surface tracking-tighter">{value}</h3>
        </div>
    );
}
