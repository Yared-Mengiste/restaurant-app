import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import LiveSearchBar from '@/Components/LiveSearchBar';
import {
    Sun, Moon, Search, Heart, ShoppingBag,
    User, History, LogOut, Settings, Home, X, ShoppingCart, ReceiptText
} from 'lucide-react';

export default function AppLayout({ children }) {
    const { auth, cart_count: cartCount = 0 } = usePage().props;
    const user = auth?.user;

    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Initial Theme sync
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const darkModeEnabled = savedTheme === 'dark';

        if (darkModeEnabled) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
            if (!savedTheme) localStorage.setItem('theme', 'light');
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const protectedLink = (e) => {
        if (!user) {
            e.preventDefault();
            router.get(route('login'));
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 transition-colors duration-300">
            {/* TOP NAVBAR */}
            <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b-2 border-secondary/30">
                <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-[1920px] mx-auto">
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href={route('home')} className="text-2xl md:text-3xl font-serif italic text-primary tracking-tight">
                            Bello <span className="text-secondary not-italic font-sans text-xs tracking-[0.3em] uppercase block">Ristorante</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* THEME TOGGLE (Desktop) */}
                        <button onClick={toggleTheme} className="hidden md:flex text-on-surface-variant hover:text-primary transition-all p-2">
                            {isDark ? <Sun size={22} /> : <Moon size={22} />}
                        </button>

                        {/* Desktop Search */}
                        <LiveSearchBar />

                        <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="md:hidden text-on-surface-variant p-2">
                            {showMobileSearch ? <X size={24} /> : <Search size={24} />}
                        </button>

                        {/* DESKTOP NAV ITEMS */}
                        <div className="hidden md:flex items-center gap-5 text-on-surface-variant border-l border-outline-variant/20 pl-6">
                            <Link href={route('favorites.index')} onClick={protectedLink} className="hover:text-primary transition-colors">
                                <Heart size={22} />
                            </Link>

                            <div className="relative">
                                <Link href={route('cart.index')} onClick={protectedLink} className="hover:text-primary transition-colors">
                                    <ShoppingBag size={22} />
                                </Link>
                                {user && cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{cartCount}</span>}
                            </div>

                            {user ? (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center hover:text-primary transition-colors outline-none">
                                        <User size={24} />
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
                                                <p className="text-xs text-primary font-bold uppercase tracking-widest">Welcome</p>
                                                <p className="text-sm font-headline text-on-surface truncate">{user.name}</p>
                                            </div>

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href={route('profile.edit')} className={`${active ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'} flex items-center gap-3 px-4 py-2 text-sm transition-colors`}>
                                                        <Settings size={18} className="text-primary" /> Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href={route('orders.history')} className={`${active ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'} flex items-center gap-3 px-4 py-2 text-sm transition-colors`}>
                                                        <History size={18} className="text-primary" /> Order History
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors text-left">
                                                        <LogOut size={18} /> Logout
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                <Link href={route('login')} className="hover:text-primary transition-colors">
                                    <User size={24} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {showMobileSearch && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-surface p-4 border-b border-outline-variant/20 animate-in fade-in slide-in-from-top-2 z-50">
                        <LiveSearchBar isMobile={true} onClose={() => setShowMobileSearch(false)} />
                    </div>
                )}
            </nav>

            <main className="transition-all duration-300 pb-32 lg:pb-0">
                {children}
            </main>

            <footer className="hidden lg:block w-full py-20 px-6 md:px-12 border-t border-outline-variant/10 bg-surface-container mt-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-7xl mx-auto">
                    <div>
                        <div className="font-headline text-primary text-2xl mb-4 italic">Bello Restaurant</div>
                        <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">Italian-inspired dining and wood-fired favorites in Addis Ababa.</p>
                        <div className="mt-5 space-y-2 text-sm text-on-surface-variant">
                            <a className="block hover:text-primary" href="https://maps.google.com/?q=Bole,Addis+Ababa" target="_blank" rel="noreferrer">Bole, Addis Ababa, Ethiopia</a>
                            <a className="block hover:text-primary" href="tel:+251911000000">+251 911 000 000</a>
                            <a className="block hover:text-primary" href="https://wa.me/251911000000" target="_blank" rel="noreferrer">WhatsApp orders</a>
                            <p>Open daily · 11:00–22:00</p>
                        </div>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-outline-variant/10 text-center">
                    <p className="font-body text-[10px] text-on-surface-variant/50 uppercase tracking-[0.2em]">
                        © 2026 Bello Restaurant. All Rights Reserved.
                    </p>
                    <div className="mt-4 flex justify-center gap-5 text-xs text-on-surface-variant"><Link href={route('legal.privacy')}>Privacy</Link><Link href={route('legal.terms')}>Terms</Link><Link href={route('legal.contact')}>Contact</Link></div>
                </div>
            </footer>

            {/* MOBILE NAVIGATION */}
            <nav className="lg:hidden fixed bottom-0 w-full pb-8 flex justify-around items-center z-50 px-6 pointer-events-none">
                <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full border border-outline-variant/30 flex justify-around items-center py-4 px-4 shadow-2xl bg-background/80 backdrop-blur-xl">

                    <Link href={route('home')} className={`flex flex-col items-center justify-center transition-all ${route().current('home') ? 'text-primary' : 'text-on-surface/40'}`}>
                        <Home size={20} />
                        <span className="font-label text-[8px] font-bold uppercase mt-1">Home</span>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="flex flex-col items-center justify-center transition-all text-on-surface/40 active:text-primary outline-none"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-label text-[8px] font-bold uppercase mt-1">
                            {isDark ? 'Light' : 'Dark'}
                        </span>
                    </button>

                    <Link href={route('cart.index')} onClick={protectedLink} className={`flex flex-col items-center justify-center transition-all scale-110 ${route().current('cart.*') ? 'text-primary' : 'text-on-surface/40'}`}>
                        <ShoppingCart size={20} />
                        <span className="font-label text-[8px] font-bold uppercase mt-1">Cart</span>
                    </Link>

                    <Link href={route('favorites.index')} onClick={protectedLink} className={`flex flex-col items-center justify-center transition-all ${route().current('favorites.*') ? 'text-primary' : 'text-on-surface/40'}`}>
                        <Heart size={20} />
                        <span className="font-label text-[8px] font-bold uppercase mt-1">Favs</span>
                    </Link>

                    <Menu as="div" className="flex flex-col items-center justify-center">
                        <Menu.Button className="flex flex-col items-center justify-center transition-all text-on-surface/40 outline-none">
                            <User size={20} />
                            <span className="font-label text-[8px] font-bold uppercase mt-1">{user ? 'Account' : 'Login'}</span>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 translate-y-4 scale-95"
                            enterTo="transform opacity-100 translate-y-0 scale-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="transform opacity-100 translate-y-0 scale-100"
                            leaveTo="transform opacity-0 translate-y-4 scale-95"
                        >
                            <Menu.Items className="fixed bottom-24 right-6 w-56 rounded-3xl bg-surface-container border border-outline-variant/20 shadow-2xl py-3 z-[60] flex flex-col overflow-hidden">
                                {user && (
                                    <div className="px-5 py-2 border-b border-outline-variant/10 mb-2">
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest truncate">{user.name}</p>
                                    </div>
                                )}

                                {user ? (
                                    <>
                                        <Menu.Item>
                                            <Link href={route('profile.edit')} className="flex items-center gap-4 px-5 py-3 text-sm text-on-surface active:bg-primary/10">
                                                <Settings size={18} className="text-primary" /> Profile
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link href={route('orders.history')} className="flex items-center gap-4 px-5 py-3 text-sm text-on-surface active:bg-primary/10">
                                                <ReceiptText size={18} className="text-primary" /> Orders
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link href={route('logout')} method="post" as="button" className="flex items-center gap-4 px-5 py-3 text-sm text-error border-t border-outline-variant/10 mt-2 active:bg-error/10 w-full text-left">
                                                <LogOut size={18} /> Logout
                                            </Link>
                                        </Menu.Item>
                                    </>
                                ) : (
                                    <Menu.Item>
                                        <Link href={route('login')} className="flex items-center gap-4 px-5 py-3 text-sm text-on-surface active:bg-primary/10">
                                            <User size={18} className="text-primary" /> Login
                                        </Link>
                                    </Menu.Item>
                                )}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </nav>
        </div>
    );
}
