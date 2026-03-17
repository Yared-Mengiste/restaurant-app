import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Menu({ categories }) {
    const [activeCategory, setActiveCategory] = useState(
        categories[0]?.id || null
    );

    const addToCart = (productId) => {
        router.post('/cart', {
            product_id: productId,
            quantity: 1
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">
                    Menu
                </h1>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto mb-6">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                activeCategory === cat.id
                                    ? 'bg-black text-white dark:bg-white dark:text-black'
                                    : 'bg-white dark:bg-gray-800'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {categories
                    .filter(cat => cat.id === activeCategory)
                    .map(cat => (
                        <div key={cat.id}>

                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {cat.products.map(product => (
                                    <div
                                        key={product.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col"
                                    >

                                        {/* Image (placeholder for now) */}
                                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />

                                        {/* Info */}
                                        <h2 className="font-semibold dark:text-white">
                                            {product.name}
                                        </h2>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">
                                            {product.description}
                                        </p>

                                        <div className="flex justify-between items-center mt-4">
                      <span className="font-bold dark:text-white">
                        ${product.price}
                      </span>

                                            <button
                                                onClick={() => addToCart(product.id)}
                                                className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-lg"
                                            >
                                                Add
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
            </div>
        </div>
    );
}
