import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Welcome({ auth }) {
    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Welcome to Foodie 🍽️
                </h2>
            }
        >
            <Head title="Welcome" />

            {/* ================= HERO ================= */}
            <section className="text-center py-16">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Delicious Food, Delivered Fast 🍔
                </h1>

                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Fresh meals from your favorite restaurant — anytime.
                </p>

                <div className="mt-6">
                    {auth.user ? (
                        <Link
                            href="/menu"
                            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            View Menu
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Login to Order
                        </Link>
                    )}
                </div>
            </section>

            {/* ================= MENU PREVIEW ================= */}
            <section className="mt-10">
                <h2 className="text-2xl font-semibold text-center mb-8">
                    Popular Dishes 🍕
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { name: "Burger", price: "$5" },
                        { name: "Pizza", price: "$8" },
                        { name: "Pasta", price: "$7" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow"
                        >
                            <h3 className="text-xl font-semibold">
                                {item.name}
                            </h3>

                            <p className="mt-2 text-gray-500">
                                {item.price}
                            </p>

                            {auth.user ? (
                                <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                    Add to Cart
                                </button>
                            ) : (
                                <p className="mt-4 text-sm text-gray-400">
                                    Login to order
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="text-center mt-20 py-10 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                <h2 className="text-2xl font-bold">
                    Ready to order?
                </h2>

                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Fast delivery to your doorstep 🚀
                </p>

                <div className="mt-4">
                    <Link
                        href={auth.user ? "/menu" : "/register"}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        {auth.user ? "Go to Menu" : "Get Started"}
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
