import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment } from 'react';
import { formatCurrency } from '@/lib/currency';

export default function Dashboard({ auth, stats, orders, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [expandedRow, setExpandedRow] = useState(null);
    const isFirstRender = useRef(true);

    const handleFilter = (status) => {
        router.get(route('admin.dashboard'),
            { ...filters, status: status, page: 1 }, // Reset to page 1 when filtering
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            router.get(route('admin.dashboard'), { search: search }, { preserveState: true, replace: true, preserveScroll: true });
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <AdminLayout>
            <Head title="Maitre D' Overview" />

            {/* Header & Stats Sections (Remained the same as previous) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-headline text-5xl font-light text-on-surface tracking-tight mb-2">
                        Maitre D' <span className="text-primary italic">Overview</span>
                    </h1>
                    <p className="font-body text-on-surface-variant max-w-md">
                        Orchestrating the evening's flow. Your digital command center for excellence.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Total Revenue" value={formatCurrency(stats.total_revenue)} growth={`${stats.revenue_growth}%`} icon="payments" color="primary" />
                <StatCard label="Today's Orders" value={stats.today_orders} subtext="Live" icon="restaurant_menu" color="tertiary" />
                <StatCard label="Pending Deliveries" value={stats.pending_deliveries} pulse={stats.pending_deliveries > 0} icon="pending_actions" color="error" />
            </div>




            <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden shadow-2xl">
                    {/* Filter & Search Bar */}
                <div className="px-8 py-6 border-b border-outline-variant/10 flex flex-col lg:flex-row justify-between items-center gap-6">
                    {/* Search Bar */}
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

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        <button
                            onClick={() => handleFilter(null)}
                            className={`${!filters.status ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'} px-6 py-2 rounded-full font-label text-[10px] uppercase font-bold tracking-widest shrink-0 transition-all`}
                        >
                            All Orders
                        </button>

                        {['pending', 'preparing', 'confirmed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleFilter(status)}
                                className={`${filters.status === status ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'} px-6 py-2 rounded-full font-label text-[10px] uppercase font-bold tracking-widest hover:text-white transition-all shrink-0`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-surface-container-high/30">
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Order ID</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Customer</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Total</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant text-right">Details</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                        {orders.data.map((order) => (
                            <Fragment key={order.id}>
                                <tr
                                    onClick={() => toggleRow(order.id)}
                                    className={`hover:bg-surface-container-high/20 transition-colors cursor-pointer group ${expandedRow === order.id ? 'bg-surface-container-high/40' : ''}`}
                                >
                                    <td className="px-8 py-6 font-mono text-xs text-primary">#{order.id}</td>
                                    <td className="px-8 py-6 font-headline text-sm">{order.user.name}</td>
                                    <td className="px-8 py-6 font-bold text-on-surface">{formatCurrency(order.total)}</td>
                                    <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-[10px] font-extrabold uppercase tracking-widest ${order.status === 'preparing' ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'preparing' ? 'bg-primary animate-pulse' : 'bg-tertiary'}`}></span>
                                                {order.status}
                                            </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                            <span className={`material-symbols-outlined transition-transform duration-300 ${expandedRow === order.id ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>
                                                expand_more
                                            </span>
                                    </td>
                                </tr>

                                {/* EXPANDABLE SECTION */}
                                {expandedRow === order.id && (
                                    <tr className="bg-surface-container-highest/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <td colSpan="5" className="px-8 py-8 border-b border-outline-variant/10">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                                                {/* Items List with Variants */}
                                                <div className="lg:col-span-2">
                                                    <h4 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-6">Items Ordered</h4>
                                                    <ul className="space-y-3">
                                                        {order.items.map((item) => (
                                                            <li key={item.id} className="flex justify-between items-center bg-background/40 p-4 rounded-xl border border-outline-variant/10">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{item.quantity}x</span>
                                                                    <div>
                                                                        <p className="text-sm font-headline text-on-surface">{item.product.name}</p>
                                                                        {item.product_variant_id && (
                                                                            <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest mt-0.5">
                                                                                Variant ID: {item.product_variant_id}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span className="font-mono text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Actions & Logistics */}
                                                <div className="space-y-6">
                                                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                                                        <h4 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-4">Update Status</h4>
                                                        <div className="flex flex-col gap-2">
                                                            {['pending', 'confirmed', 'preparing', 'delivering', 'completed'].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        router.patch(route('admin.orders.update', order.id), { status: s }, { preserveScroll: true });
                                                                    }}
                                                                    className={`text-left px-4 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${order.status === s ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'}`}
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 text-[10px] uppercase tracking-widest font-bold">
                                                        <h4 className="text-primary mb-4">Logistics</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between border-b border-outline-variant/5 pb-1">
                                                                <span className="text-on-surface-variant">Method</span>
                                                                <span className="text-on-surface">{order.delivery_type}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-outline-variant/5 pb-1">
                                                                <span className="text-on-surface-variant">Payment</span>
                                                                <span className="text-on-surface">{order.payment_status}</span>
                                                            </div>
                                                            <div className="pt-1">
                                                                <span className="text-on-surface-variant block mb-1">Email</span>
                                                                <span className="text-on-surface lowercase font-normal tracking-normal text-xs">{order.user.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
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

// StatCard component remains the same...

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
