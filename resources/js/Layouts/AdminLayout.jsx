import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
    Sun,
    Moon,
    User,
    Settings,
    LogOut,
    UtensilsCrossed,
    Beef,
    Layers,
    LayoutDashboard
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // --- THEME STATE LOGIC ---
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        const darkModeEnabled = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(darkModeEnabled);
        if (darkModeEnabled) document.documentElement.classList.add('dark');
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

    // SECURITY GUARD
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.get(route('login'));
        }
    }, [user]);

    if (!user || user.role !== 'admin') return null;

    // Sidebar items configuration
    const navItems = [
        { name: 'orders', label: 'Orders', icon: UtensilsCrossed, route: 'admin.orders' },
        { name: 'products', label: 'Products', icon: Beef, route: 'admin.products' },
        { name: 'categories', label: 'Categories', icon: Layers, route: 'admin.categories.index' },
        { name: 'settings', label: 'Dashboard', icon: LayoutDashboard, route: 'admin.dashboard' },
    ];

    return (
        <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary-fixed overflow-x-hidden transition-colors duration-300">

            {/* TOP NAVBAR */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-12 py-4 max-w-[1920px] mx-auto border-b-2 border-secondary/30">
                <div className="flex items-center gap-8">
                    <Link href={route('admin.dashboard')} className="text-2xl md:text-3xl font-serif italic text-primary tracking-tight">
                        Bello <span className="text-secondary not-italic font-sans text-xs tracking-[0.3em] uppercase block">Admin</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Menu as="div" className="relative">
                        <Menu.Button className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden outline-none hover:border-primary transition-colors">
                            <img
                                className="w-full h-full object-cover"
                                src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${user.name}`}
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
                            <Menu.Items className="absolute right-0 mt-4 w-60 origin-top-right rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-2xl py-2 focus:outline-none z-[60]">
                                <div className="px-4 py-3 border-b border-outline-variant/10 mb-2">
                                    <p className="text-xs text-primary font-bold uppercase tracking-widest">Administrator</p>
                                    <p className="text-sm font-headline text-on-surface truncate">{user.name}</p>
                                </div>

                                <Menu.Item>
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors text-left"
                                    >
                                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                        {isDark ? 'Switch to Light' : 'Switch to Dark'}
                                    </button>
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                        <Link href={route('profile.edit')} className={`${active ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'} flex items-center gap-3 px-4 py-2 text-sm transition-colors`}>
                                            <User size={18} /> Profile Settings
                                        </Link>
                                    )}
                                </Menu.Item>

                                <div className="mt-2 pt-2 border-t border-outline-variant/10">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors">
                                                <LogOut size={18} /> Sign Out
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </header>

            {/* SIDEBAR (Desktop) */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low hidden lg:flex flex-col py-8 border-r border-outline-variant/10 z-40">
                <div className="px-8 mt-24 mb-12">
                    <h3 className="font-['Manrope'] text-sm uppercase tracking-[0.1em] text-on-surface-variant/50">Management</h3>
                    <p className="text-primary text-[10px] uppercase tracking-widest font-bold mt-1">Admin Command Center</p>
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={route(item.route)}
                                    className={`flex items-center gap-4 px-8 py-4 mr-4 font-['Manrope'] text-sm uppercase tracking-[0.1em] transition-all rounded-r-full
                                    ${route().current(item.route.replace('.index', '') + '*')
                                        ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                                        : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-high'}`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* MAIN CANVAS */}
            <main className="lg:ml-64 pt-32 px-6 lg:px-12 pb-32 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* MOBILE NAV (Bottom) */}
            <nav className="lg:hidden fixed bottom-0 w-full pb-8 flex justify-around items-center z-50 px-6 pointer-events-none">
                <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full border border-outline-variant/20 flex justify-around py-4 bg-background/80 backdrop-blur-xl shadow-2xl">
                    {navItems.filter(i => i.name !== 'settings').map((item) => (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`flex flex-col items-center justify-center transition-all ${route().current(item.route.replace('.index', '') + '*') ? 'text-primary' : 'text-on-surface-variant/50'}`}
                        >
                            <item.icon size={20} />
                            <span className="text-[8px] uppercase font-bold mt-1">{item.name === 'categories' ? 'Cats' : item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
