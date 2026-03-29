import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Products({ products, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const isFirstRender = useRef(true);

    // Debounced Search Logic
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            router.get(route('admin.products'), { search: search }, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <AdminLayout>
            <Head title="Menu Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-headline text-5xl font-light text-on-surface tracking-tight mb-2">
                        The <span className="text-primary italic">Catalogue</span>
                    </h1>
                    <p className="font-body text-on-surface-variant max-w-md text-sm">
                        Refine your offerings. Manage descriptions, pricing, and availability of your culinary masterpieces.
                    </p>
                </div>
                <Link
                    href={route('admin.products.create')}
                    className="bg-primary text-black px-8 py-3 rounded-full font-label text-[10px] uppercase font-bold tracking-[0.2em] hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Entry
                </Link>
            </div>

            {/* Main Content Card */}
            <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden shadow-2xl">

                {/* Search Bar Area */}
                <div className="px-8 py-6 border-b border-outline-variant/10">
                    <div className="relative w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or category..."
                            className="w-full bg-surface-container-highest border-none rounded-full py-3 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary/50 font-body text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-surface-container-high/30">
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Item</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Category</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Price</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
                            <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                        {products.data.map((product) => (
                            <tr key={product.id} className="hover:bg-surface-container-high/20 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-highest shrink-0">
                                            <img src={(product?.image ? `/storage/products/${product.image}` : null)} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-headline text-sm text-on-surface">{product.name}</p>
                                            <p className="font-mono text-[10px] text-primary">ID: #{product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                        <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                </td>
                                <td className="px-8 py-5 font-bold text-on-surface">
                                    ${Number(product.price).toFixed(2)}
                                </td>
                                <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                                            product.is_available
                                                ? 'bg-primary/5 border-primary/20 text-primary'
                                                : 'bg-error/5 border-error/20 text-error'
                                        }`}>
                                            <span className={`w-1 h-1 rounded-full ${product.is_available ? 'bg-primary animate-pulse' : 'bg-error'}`}></span>
                                            {product.is_available ? 'Live' : 'Archived'}
                                        </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={route('admin.products.show', product.id)}
                                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </Link>
                                        <Link
                                            href={route('admin.products.edit', product.id)}
                                            className="p-2 text-on-surface-variant hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit_note</span>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Standard Inertia) */}
                <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-between items-center">
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                        Showing {products.from} to {products.to} of {products.total} entries
                    </p>
                    <div className="flex gap-2">
                        {products.links.map((link, i) => (
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
