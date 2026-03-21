import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [search, setSearch] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('home'), { search }, { preserveState: true, replace: true });
        setShowMobileSearch(false);
    };

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
                    {/* LEFT: Logo */}
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href={route('home')} className="text-xl md:text-2xl font-headline italic text-primary tracking-tighter whitespace-nowrap">
                            Bello Restaurant
                        </Link>
                    </div>

                    {/* RIGHT: Desktop Search & Icons */}
                    <div className="flex items-center gap-3 md:gap-6">
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

                        <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="md:hidden material-symbols-outlined text-on-surface-variant p-2">
                            search
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
                        <form onSubmit={handleSearch}>
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

            {/* MAIN CONTENT - Added padding bottom for mobile nav clearance */}
            <main className="transition-all duration-300 pb-32 lg:pb-0">
                {children}
            </main>

            {/* FOOTER SECTION */}
            <footer className="w-full py-20 px-6 md:px-12 border-t border-outline-variant/10 bg-surface-container-lowest mt-12 mb-24 lg:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-7xl mx-auto">
                    <div>
                        <div className="font-headline text-primary text-2xl mb-4 italic">
                            Bello Restaurant</div>
                        <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
                            An odyssey of taste, where every ingredient tells a story of heritage and passion.
                        </p>
                    </div>
                    <div>
                        <h5 className="text-white font-label uppercase tracking-widest text-xs mb-6">Explore</h5>
                        <div className="flex flex-col gap-4 text-on-surface-variant font-body text-sm">
                            <Link href={route('home')} className="hover:text-primary transition-colors">Menu</Link>
                            <a className="hover:text-primary transition-colors" href="#">Location</a>
                            <a className="hover:text-primary transition-colors" href="#">Contact</a>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-white font-label uppercase tracking-widest text-xs mb-6">Dining Hours</h5>
                        <div className="flex flex-col gap-2 text-on-surface-variant font-body text-sm">
                            <p>Mon - Thu: 5:00 PM - 11:00 PM</p>
                            <p>Fri - Sat: 5:00 PM - 1:00 AM</p>
                            <p>Sunday: 11:00 AM - 10:00 PM</p>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-white font-label uppercase tracking-widest text-xs mb-6">Newsletter</h5>
                        <div className="flex flex-col gap-4">
                            <p className="text-on-surface-variant font-body text-sm">Join our list for seasonal updates.</p>
                            <div className="relative">
                                <input
                                    className="bg-transparent border-b border-outline-variant/30 w-full py-2 text-sm focus:border-primary outline-none text-white transition-all"
                                    placeholder="Email Address"
                                    type="email"
                                />
                                <button className="absolute right-0 bottom-2 text-primary">
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-white/5 text-center">
                    <p className="font-body text-[10px] text-on-surface-variant/50 uppercase tracking-[0.2em]">
                        © 2026 Bello Restaurant. All Rights Reserved.
                    </p>
                </div>
            </footer>

            {/* MOBILE NAVIGATION: Floating Capsule */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] rounded-2xl bg-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl flex justify-around items-center z-50 px-2 py-3">
                <Link href={route('home')} className="flex flex-col items-center gap-1 min-w-[64px] text-primary">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-label uppercase tracking-tighter">Home</span>
                </Link>
                {/* ... other mobile links ... */}
            </nav>
        </div>
    );
}
