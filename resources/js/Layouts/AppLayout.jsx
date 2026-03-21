import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [search, setSearch] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/', { search }, { preserveState: true, replace: true });
        setShowMobileSearch(false);
    };

    const protectedLink = (e, path) => {
        if (!user) {
            e.preventDefault();
            router.get(route('register'));
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 pb-24 lg:pb-0">

            {/* TOP NAVBAR */}
            <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-outline-variant/10">
                <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-[1920px] mx-auto">

                    {/* LEFT: Logo & Desktop Links */}
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href="/" className="text-xl md:text-2xl font-headline italic text-primary tracking-tighter whitespace-nowrap">
                            Bello Restaurant
                        </Link>

                    </div>

                    {/* RIGHT: Desktop Search & Icons */}
                    <div className="flex items-center gap-3 md:gap-6">

                        {/* Search (Desktop Toggle or Input) */}
                        <form onSubmit={handleSearch} className="relative group hidden md:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search our menu..."
                                className="bg-surface-container-highest/30 border border-outline-variant/20 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-48 lg:w-64 outline-none text-white transition-all"
                            />
                        </form>

                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                            className="md:hidden material-symbols-outlined text-on-surface-variant p-2"
                        >
                            search
                        </button>

                        {/* Action Icons (Desktop Only - Mobile has Bottom Nav) */}
                        <div className="hidden md:flex items-center gap-5 text-on-surface-variant border-l border-outline-variant/20 pl-6">
                            <Link href="/favorites" onClick={(e) => protectedLink(e)} className="material-symbols-outlined hover:text-primary transition-colors">favorite</Link>

                            <div className="relative">
                                <Link href="/cart" onClick={(e) => protectedLink(e)} className="material-symbols-outlined hover:text-primary transition-colors">shopping_bag</Link>
                                {user && <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>}
                            </div>

                            <Link href={user ? route('profile.edit') : route('register')} className="material-symbols-outlined hover:text-primary transition-colors">person</Link>
                        </div>
                    </div>
                </div>

                {/* MOBILE SEARCH OVERLAY (Appears when clicking search icon) */}
                {showMobileSearch && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-surface p-4 border-b border-outline-variant/20 animate-in fade-in slide-in-from-top-2">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="What are you craving?"
                                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
                            />
                        </form>
                    </div>
                )}
            </nav>

            {/* MAIN CONTENT */}
            <main className="transition-all duration-300">
                {children}
            </main>

            {/* MOBILE NAVIGATION: The "Floating Capsule" */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] rounded-2xl bg-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl flex justify-around items-center z-50 px-2 py-3">
                <Link href="/" className="flex flex-col items-center gap-1 min-w-[64px] text-primary">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-label uppercase tracking-tighter">Home</span>
                </Link>

                <Link href="/menu" className="flex flex-col items-center gap-1 min-w-[64px] text-on-surface-variant/70">
                    <span className="material-symbols-outlined">restaurant_menu</span>
                    <span className="text-[10px] font-label uppercase tracking-tighter">Menu</span>
                </Link>

                <Link href="/cart" onClick={(e) => protectedLink(e)} className="relative flex flex-col items-center gap-1 min-w-[64px] text-on-surface-variant/70">
                    <span className="material-symbols-outlined">shopping_bag</span>
                    <span className="text-[10px] font-label uppercase tracking-tighter">Cart</span>
                    {user && <span className="absolute top-0 right-4 bg-primary text-[8px] text-black font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">2</span>}
                </Link>

                <Link href={user ? route('profile.edit') : route('register')} className="flex flex-col items-center gap-1 min-w-[64px] text-on-surface-variant/70">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-label uppercase tracking-tighter">{user ? 'Profile' : 'Login'}</span>
                </Link>
            </nav>
        </div>
    );
}
