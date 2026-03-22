import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function AppLayout({ children }) {
    const { auth, filters } = usePage().props;
    const user = auth?.user;

    // 1. Search Logic State
    const [search, setSearch] = useState(filters?.search || '');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const isFirstRender = useRef(true);

    // 2. Debounced Search Engine
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('home'),
                {
                    search: search,
                    category_id: filters?.category_id
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true
                }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const protectedLink = (e) => {
        if (!user) {
            e.preventDefault();
            router.get(route('register'));
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30">

            {/* TOP NAVBAR */}
            <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-outline-variant/10">
                <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-[1920px] mx-auto">

                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href={route('home')} className="text-xl md:text-2xl font-headline italic text-primary tracking-tighter whitespace-nowrap">
                            Bello Restaurant
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* DESKTOP SEARCH */}
                        <div className="relative group hidden md:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search our menu..."
                                className="bg-surface-container-highest/30 border border-outline-variant/20 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-48 lg:w-64 outline-none text-white transition-all"
                            />
                        </div>

                        <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="md:hidden material-symbols-outlined text-on-surface-variant p-2">
                            {showMobileSearch ? 'close' : 'search'}
                        </button>

                        <div className="hidden md:flex items-center gap-5 text-on-surface-variant border-l border-outline-variant/20 pl-6">
                            <Link href="/favorites" onClick={protectedLink} className="material-symbols-outlined hover:text-primary transition-colors">favorite</Link>
                            <div className="relative">
                                <Link href="/cart" onClick={protectedLink} className="material-symbols-outlined hover:text-primary transition-colors">shopping_bag</Link>
                                {user && <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>}
                            </div>
                            <Link href={user ? route('profile.edit') : route('register')} className="material-symbols-outlined hover:text-primary transition-colors">person</Link>
                        </div>
                    </div>
                </div>

                {/* MOBILE SEARCH OVERLAY */}
                {showMobileSearch && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-surface p-4 border-b border-outline-variant/20 animate-in fade-in slide-in-from-top-2">
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="What are you craving?"
                            className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
                        />
                    </div>
                )}
            </nav>

            {/* MAIN CONTENT: Added padding-bottom for mobile nav clearance */}
            <main className="transition-all duration-300 pb-32 lg:pb-0">
                {children}
            </main>

            {/* FOOTER: Hidden on mobile as requested */}
            <footer className="hidden lg:block w-full py-20 px-6 md:px-12 border-t border-outline-variant/10 bg-surface-container-lowest mt-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-7xl mx-auto">
                    <div>
                        <div className="font-headline text-primary text-2xl mb-4 italic">Bello Restaurant</div>
                        <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
                            An odyssey of taste, where every ingredient tells a story of heritage and passion.
                        </p>
                    </div>
                    {/* Add more footer columns here if needed */}
                </div>
                <div className="mt-20 pt-8 border-t border-white/5 text-center">
                    <p className="font-body text-[10px] text-on-surface-variant/50 uppercase tracking-[0.2em]">
                        © 2026 Bello Restaurant. All Rights Reserved.
                    </p>
                </div>
            </footer>

            {/* MOBILE BOTTOM NAVIGATION */}
            <nav className="lg:hidden fixed bottom-0 w-full pb-8 flex justify-around items-center z-50 px-6 bg-[#111316]/90 backdrop-blur-2xl border-t border-white/5">
                <Link
                    href={route('home')}
                    className={`flex flex-col items-center justify-center transition-transform ${route().current('home') ? 'text-[#f8c927]' : 'text-white/40 hover:text-[#f8c927]'}`}
                >
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-['Manrope'] text-[10px] font-bold uppercase mt-1">Home</span>
                </Link>

                <Link
                    href="/favorites"
                    onClick={protectedLink}
                    className={`flex flex-col items-center justify-center transition-transform ${route().current('favorites') ? 'text-[#f8c927]' : 'text-white/40 hover:text-[#f8c927]'}`}
                >
                    <span className="material-symbols-outlined">favorite</span>
                    <span className="font-['Manrope'] text-[10px] font-bold uppercase mt-1">Favorites</span>
                </Link>

                {/* CART INSTEAD OF MENU */}
                <Link
                    href="/cart"
                    onClick={protectedLink}
                    className={`flex flex-col items-center justify-center transition-transform scale-110 ${route().current('cart') ? 'text-[#f8c927]' : 'text-white/40 hover:text-[#f8c927]'}`}
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: route().current('cart') ? "'FILL' 1" : "'FILL' 0" }}
                    >
                        shopping_bag
                    </span>
                    <span className="font-['Manrope'] text-[10px] font-bold uppercase mt-1">Cart</span>
                </Link>

                <Link
                    href={user ? route('profile.edit') : route('register')}
                    className={`flex flex-col items-center justify-center transition-transform ${route().current('profile.edit') ? 'text-[#f8c927]' : 'text-white/40 hover:text-[#f8c927]'}`}
                >
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-['Manrope'] text-[10px] font-bold uppercase mt-1">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
