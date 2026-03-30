import { Link, usePage, router, Head } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

export default function AdminProductLayout({ product, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Search logic (kept for filtering products/orders)
    const [search, setSearch] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const toggleAvailability = () => {
        if (confirm(`Are you sure you want to ${product.is_available ? 'archive' : 'restore'} this product?`)) {
            router.patch(route('admin.products.toggle', product.id), {}, { preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface font-body">
            <Head title={`Admin - ${product.name}`} />

            {/* ADMIN TOP NAVBAR */}
            <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-outline-variant/10">
                <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-[1920px] mx-auto">
                    <div className="flex items-center gap-8">
                        <Link href={route('admin.dashboard')} className="text-xl md:text-2xl font-headline italic text-primary tracking-tighter">
                            Bello Admin
                        </Link>

                        {/* Desktop Management Links */}
                        <div className="hidden lg:flex items-center gap-6 ml-4 border-l border-outline-variant/20 pl-8">
                            <Link href={route('admin.orders')} className="text-[10px] uppercase font-bold tracking-widest hover:text-primary transition-colors">Orders</Link>
                            <Link href={route('admin.products')} className="text-[10px] uppercase font-bold tracking-widest text-primary">Products</Link>
                            <Link href={route('admin.categories.index')} className="text-[10px] uppercase font-bold tracking-widest hover:text-primary transition-colors">Categories</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Profile Dropdown */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center material-symbols-outlined hover:text-primary transition-colors outline-none">
                                account_circle
                            </Menu.Button>
                            <Transition as={Fragment} /* ... same transition as before ... */ >
                                <Menu.Items className="absolute right-0 mt-4 w-56 origin-top-right rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-2xl py-2 z-[60]">
                                    <div className="px-4 py-3 border-b border-outline-variant/10 mb-2">
                                        <p className="text-xs text-primary font-bold uppercase tracking-widest">Admin Portal</p>
                                        <p className="text-sm font-headline text-on-surface truncate">{user.name}</p>
                                    </div>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors">
                                                <span className="material-symbols-outlined text-lg">logout</span> Logout
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="min-h-screen pt-12 pb-40 px-6 md:px-12 max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Image Section */}
                    <div className="w-full lg:w-3/5">
                        <div className={`aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low shadow-2xl ${!product.is_available ? 'opacity-40 grayscale' : ''}`}>
                            <img
                                src={product?.image ? product.image : '/placeholder.jpg'}
                                className="w-full h-full object-cover"
                                alt={product.name}
                            />
                        </div>
                    </div>

                    {/* Admin Actions & Details */}
                    <div className="w-full lg:w-2/5 flex flex-col gap-8">
                        <div>
                            <div className="mb-6 flex gap-3">
                                <Link
                                    href={route('admin.products.edit', product.id)}
                                    className="bg-white text-black px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                                >
                                    Edit Details
                                </Link>
                                <button
                                    onClick={toggleAvailability}
                                    className={`px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest border transition-all ${
                                        product.is_available ? 'border-error/30 text-error hover:bg-error/10' : 'border-primary/30 text-primary hover:bg-primary/10'
                                    }`}
                                >
                                    {product.is_available ? 'Archive Product' : 'Restore Product'}
                                </button>
                            </div>

                            <h1 className="font-headline text-5xl text-on-surface mb-4">{product.name}</h1>
                            <p className="text-3xl font-headline text-primary mb-6">${Number(product.price).toFixed(2)}</p>
                            <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
                        </div>

                        {/* Summary Stats for Admin */}
                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-outline-variant/10">
                            <div className="bg-surface-container rounded-2xl p-6">
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
                                <p className={`font-bold ${product.is_available ? 'text-green-500' : 'text-error'}`}>
                                    {product.is_available ? 'Live' : 'Archived'}
                                </p>
                            </div>
                            <div className="bg-surface-container rounded-2xl p-6">
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Variants</p>
                                <p className="font-bold">{product.variants?.length || 0} Options</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MOBILE ADMIN NAV */}
            <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full border border-outline-variant/20 flex justify-around items-center py-4 px-4 bg-background/80 backdrop-blur-xl z-50 shadow-2xl">
                <Link href={route('admin.dashboard')} className="flex flex-col items-center text-white/40 active:text-primary">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-[8px] uppercase font-bold mt-1">Dash</span>
                </Link>
                <Link
                    href={route('admin.categories.index')}
                    className={`flex flex-col items-center transition-all ${route().current('admin.categories.*') ? 'text-primary' : 'text-white/40 active:text-primary'}`}
                >
                    <span className="material-symbols-outlined">category</span>
                    <span className="text-[8px] uppercase font-bold mt-1">Categories</span>
                </Link>
                <Link href={route('admin.products')} className="flex flex-col items-center text-primary">
                    <span className="material-symbols-outlined">inventory_2</span>
                    <span className="text-[8px] uppercase font-bold mt-1">Items</span>
                </Link>
            </nav>
        </div>
    );
}
