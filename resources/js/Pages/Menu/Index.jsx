import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Menu({ categories, auth }) {
    const user = auth?.user;

    const [activeCategory, setActiveCategory] = useState(
        categories[0]?.id || null
    );

    const addToCart = (productId) => {
        if (!user) {
            router.visit('/login');
            return;
        }

        router.post('/cart', {
            product_id: productId,
            quantity: 1,
        });
    };

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    🍽️ Our Menu
                </h2>
            }
        >
            <Head title="Menu" />

            <div className="min-h-screen">

                {/* ================= CATEGORY TABS ================= */}
                <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                                activeCategory === cat.id
                                    ? 'bg-red-500 text-white shadow'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* ================= PRODUCTS ================= */}
                {categories
                    .filter((cat) => cat.id === activeCategory)
                    .map((cat) => (
                        <div
                            key={cat.id}
                            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {cat.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                                >
                                    {/* Image Placeholder */}
                                    <div className="h-40 bg-gray-200 dark:bg-gray-700" />

                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold dark:text-white">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-grow">
                                            {product.description}
                                        </p>

                                        {/* Price + Button */}
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-lg font-bold text-red-500">
                                                ${product.price}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    addToCart(product.id)
                                                }
                                                className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                                            >
                                                {user ? 'Add to Cart' : 'Login'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </AppLayout>
    );
}
