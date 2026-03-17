import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const toggleDark = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition">

            {/* NAVBAR */}
            <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">

                        {/* LEFT */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <ApplicationLogo className="h-8 w-8" />
                                <span className="font-bold text-lg dark:text-white">
                                    Foodie
                                </span>
                            </Link>

                            {/* Desktop Links */}
                            <div className="hidden sm:flex gap-6">
                                <NavLink href="/menu">
                                    Menu
                                </NavLink>

                                <NavLink href="/cart">
                                    Cart
                                </NavLink>

                                <NavLink href="#">
                                    Orders
                                </NavLink>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="hidden sm:flex items-center gap-4">

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDark}
                                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
                            >
                                🌙
                            </button>

                            {/* User Dropdown */}
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
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <div className="sm:hidden flex items-center">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(!showingNavigationDropdown)
                                }
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
                        <ResponsiveNavLink href="/cart">Cart</ResponsiveNavLink>

                        <div className="border-t pt-2">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                )}
            </nav>

            {/* HEADER */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="mx-auto max-w-6xl px-4 py-4">
                        {header}
                    </div>
                </header>
            )}

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-6xl p-4 md:p-6">
                {children}
            </main>
        </div>
    );
}
