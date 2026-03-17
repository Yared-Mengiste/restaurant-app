import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ header, children }) {
    const user = usePage().props.auth.user; // null if not logged in
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const toggleDark = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition">

            {/* NAVBAR */}
            <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">

                        {/* LEFT: Logo + Desktop Links */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <ApplicationLogo className="h-8 w-8" />
                                <span className="font-bold text-lg dark:text-white">
                                    Foodie
                                </span>
                            </Link>

                            {/* Desktop Links */}
                            <div className="hidden sm:flex gap-6">
                                <NavLink href="/menu">Menu</NavLink>

                                {user ? (
                                    <>
                                        <NavLink href="/cart">Cart</NavLink>
                                        <NavLink href="/orders">Orders</NavLink>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        {/* RIGHT: Auth / User Dropdown + Dark Mode */}
                        <div className="hidden sm:flex items-center gap-4">

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDark}
                                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
                            >
                                🌙
                            </button>

                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="text-sm font-medium dark:text-white">
                                            {user.name}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent hover:text-black/70 dark:text-white dark:hover:text-white/80"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent hover:text-black/70 dark:text-white dark:hover:text-white/80"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <div className="sm:hidden flex items-center">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="p-2"
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-800">
                        <ResponsiveNavLink href="/menu">Menu</ResponsiveNavLink>

                        {user ? (
                            <>
                                <ResponsiveNavLink href="/cart">Cart</ResponsiveNavLink>
                                <ResponsiveNavLink href="/orders">Orders</ResponsiveNavLink>
                                <div className="border-t pt-2">
                                    <ResponsiveNavLink href={route('profile.edit')}>
                                        Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <>
                                <ResponsiveNavLink href={route('login')}>Log In</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')}>Register</ResponsiveNavLink>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* HEADER */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="mx-auto max-w-6xl px-4 py-4">{header}</div>
                </header>
            )}

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
        </div>
    );
}
