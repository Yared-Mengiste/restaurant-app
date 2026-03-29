import React, { useState, Fragment } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, Link } from '@inertiajs/react';

export default function OrderHistory({ orders }) {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <AppLayout>
            <Head title="Order History" />

            <main className="pt-32 pb-40 px-6 md:px-12 max-w-[1400px] mx-auto min-h-screen">
                <header className="mb-12">
                    <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-light tracking-tight mb-4">
                        Order <span className="text-primary italic">History</span>
                    </h1>
                    <p className="font-body text-on-surface-variant">
                        Review your previous culinary journeys with us.
                    </p>
                </header>

                <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-surface-container-high/30">
                                <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Order</th>
                                <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Date</th>
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
                                        <td className="px-8 py-6 font-mono text-xs text-primary">#{order.id.toString().padStart(5, '0')}</td>
                                        <td className="px-8 py-6 text-sm text-on-surface-variant">
                                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6 font-bold text-on-surface">${Number(order.total).toFixed(2)}</td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                                <span className={`material-symbols-outlined transition-transform duration-300 ${expandedRow === order.id ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>
                                                    expand_more
                                                </span>
                                        </td>
                                    </tr>

                                    {/* EXPANDABLE ITEM DETAILS */}
                                    {expandedRow === order.id && (
                                        <tr className="bg-surface-container-highest/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <td colSpan="5" className="px-8 py-8">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                                                    {/* Items List */}
                                                    <div className="lg:col-span-2 space-y-4">
                                                        <h4 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-4">Items Summary</h4>
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center bg-background/40 p-4 rounded-2xl border border-outline-variant/10">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-surface-container-high overflow-hidden">
                                                                        <img src={item.product.image_url || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-headline text-on-surface">{item.product.name}</p>
                                                                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                                                                            {item.variant?.name || 'Standard'} • Qty: {item.quantity}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="font-mono text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Logistics/Summary */}
                                                    <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
                                                        <h4 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-6">Order Logistics</h4>
                                                        <div className="space-y-4 text-[11px] uppercase tracking-widest font-bold">
                                                            <div className="flex justify-between border-b border-outline-variant/5 pb-2">
                                                                <span className="text-on-surface-variant">Service</span>
                                                                <span className="text-on-surface">{order.delivery_type}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-outline-variant/5 pb-2">
                                                                <span className="text-on-surface-variant">Payment</span>
                                                                <span className="text-on-surface text-success">{order.payment_status}</span>
                                                            </div>
                                                            <div className="pt-2">
                                                                <Link
                                                                    href={route('products.show', order.items[0]?.product_id)}
                                                                    className="w-full py-4 bg-surface-container-highest rounded-full text-center block hover:bg-primary hover:text-on-primary transition-all"
                                                                >
                                                                    Order Again
                                                                </Link>
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

                    {/* Simple Pagination */}
                    {orders.total > orders.per_page && (
                        <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-center gap-2">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
                                        ${link.active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}
                                        ${!link.url ? 'opacity-20 cursor-not-allowed' : ''}
                                    `}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </AppLayout>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'text-amber-500 bg-amber-500/10',
        confirmed: 'text-blue-500 bg-blue-500/10',
        preparing: 'text-primary bg-primary/10',
        delivering: 'text-purple-500 bg-purple-500/10',
        completed: 'text-green-500 bg-green-500/10',
    };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${styles[status] || 'bg-surface-container-highest text-on-surface-variant'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'preparing' || status === 'delivering' ? 'animate-pulse bg-current' : 'bg-current'}`}></span>
            {status}
        </span>
    );
}
