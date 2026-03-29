import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // SECURITY GUARD: Redirect if not admin
    // Assuming your user object has a 'role' field. Adjust if you use a different check.
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.get(route('login'));
        }
    }, [user]);

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary-fixed overflow-x-hidden">

            {/* TOP NAVBAR (From AppLayout logic + Lumière Style) [cite: 103, 104] */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-[#4d4635]/10 flex justify-between items-center px-6 md:px-12 py-4 max-w-[1920px] mx-auto">
                <div className="flex items-center gap-8">
                    <Link href={route('admin.dashboard')} className="text-2xl font-['Noto_Serif'] italic text-[#f8c927] tracking-tighter">
                        Bello Admin
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {/* Desktop Profile Dropdown [cite: 112, 113, 117] */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden outline-none">
                            <img
                                className="w-full h-full object-cover"
                                src={user.profile_photo_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDMbnH3F4dSIgyVQiu0wYTif2iVNZ7WJeH_ljG9LiGmH5xO9hLXuv4AUPtn3ggA7WRs_FPn-6TFNkeKS0jcuNvKGURbqGLirE3Kfl6qoU0nB-hsxgHIEMIEgNUAbJQc6Tm_YAzRl-j7715ksA9cjvJJfe0-a0hcyPrb7ngVhTGLTv6ioWySm-DexiJ7TtdCMcA7WoZxRY4F4dsJng3zR5a20eBcaGhecwNtalx6lm7VAkA8S1eAVoxTP1WS2xnmURadSgNQ_RIQsFcJ"}
                                alt="Admin Avatar"
                            />
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-4 w-56 origin-top-right rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-2xl py-2 focus:outline-none z-[60]">
                                <div className="px-4 py-3 border-b border-outline-variant/10 mb-2">
                                    <p className="text-xs text-primary font-bold uppercase tracking-widest">Administrator</p>
                                    <p className="text-sm font-headline text-on-surface truncate">{user.name}</p>
                                </div>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link href={route('profile.edit')} className={`${active ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'} flex items-center gap-3 px-4 py-2 text-sm transition-colors`}>
                                            <span className="material-symbols-outlined text-lg">person</span> Profile
                                        </Link>
                                    )}
                                </Menu.Item>
                                <div className="mt-2 pt-2 border-t border-outline-variant/10">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors">
                                                <span className="material-symbols-outlined text-lg">logout</span> Logout
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </header>

            {/* SIDEBAR (The Collection)  */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1c1f] hidden lg:flex flex-col py-8 border-r border-[#4d4635]/20 z-40">
                <div className="px-8 mt-24 mb-12">
                    <h3 className="font-['Manrope'] text-sm uppercase tracking-[0.1em] text-white/50">Management</h3>
                    <p className="text-primary text-[10px] uppercase tracking-widest font-bold mt-1">Admin Command Center</p>
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href={route('admin.dashboard')}
                                className={`flex items-center gap-4 px-8 py-4 mr-4 font-['Manrope'] text-sm uppercase tracking-[0.1em] transition-all rounded-r-full
                                ${route().current('admin.orders') ? 'bg-[#333538] text-[#f8c927]' : 'text-white/50 hover:text-white hover:bg-[#333538]/50'}`}
                            >
                                <span className="material-symbols-outlined">restaurant</span> Orders
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('admin.products')}
                                className={`flex items-center gap-4 px-8 py-4 mr-4 font-['Manrope'] text-sm uppercase tracking-[0.1em] transition-all rounded-r-full
                                ${route().current('admin.products') ? 'bg-[#333538] text-[#f8c927]' : 'text-white/50 hover:text-white hover:bg-[#333538]/50'}`}
                            >
                                <span className="material-symbols-outlined">flatware</span> Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('admin.categories.index')}
                                className={`flex items-center gap-4 px-8 py-4 mr-4 font-['Manrope'] text-sm uppercase tracking-[0.1em] transition-all rounded-r-full
                                ${route().current('admin.categories') ? 'bg-[#333538] text-[#f8c927]' : 'text-white/50 hover:text-white hover:bg-[#333538]/50'}`}
                            >
                                <span className="material-symbols-outlined">category</span> Categories
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('admin.dashboard')}
                                className={`flex items-center gap-4 px-8 py-4 mr-4 font-['Manrope'] text-sm uppercase tracking-[0.1em] transition-all rounded-r-full
                                ${route().current('admin.settings') ? 'bg-[#333538] text-[#f8c927]' : 'text-white/50 hover:text-white hover:bg-[#333538]/50'}`}
                            >
                                <span className="material-symbols-outlined">settings</span> Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* MAIN CANVAS (Middle Presentation)  */}
            <main className="lg:ml-64 pt-32 px-6 lg:px-12 pb-32">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* MOBILE BOTTOM NAV (Admin Version)  */}
            <nav className="lg:hidden fixed bottom-0 w-full pb-8 flex justify-around items-center z-50 px-6 pointer-events-none">
                <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full border border-[#4d4635]/30 glassmorphism-border flex justify-around py-4 bg-background/80 backdrop-blur-xl">
                    <Link href={route('admin.dashboard')} className={`flex flex-col items-center justify-center transition-all ${route().current('admin.orders') ? 'text-[#f8c927]' : 'text-white/40'}`}>
                        <span className="material-symbols-outlined">restaurant</span>
                        <span className="text-[10px] uppercase font-bold mt-1">Orders</span>
                    </Link>
                    <Link href={route('admin.products')} className={`flex flex-col items-center justify-center transition-all ${route().current('admin.products') ? 'text-[#f8c927]' : 'text-white/40'}`}>
                        <span className="material-symbols-outlined">flatware</span>
                        <span className="text-[10px] uppercase font-bold mt-1">Items</span>
                    </Link>
                    <Link href={route('admin.categories.index')} className={`flex flex-col items-center justify-center transition-all ${route().current('admin.categories.index') ? 'text-[#f8c927]' : 'text-white/40'}`}>
                        <span className="material-symbols-outlined">category</span>
                        <span className="text-[10px] uppercase font-bold mt-1">Cats</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
