import { router } from '@inertiajs/react';

export default function Cart({ cart, total }) {

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        router.put('/cart', { product_id: productId, quantity });
    };

    const removeItem = (productId) => {
        router.delete('/cart', { product_id: productId });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Cart</h1>

                {cart?.items?.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
                )}

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-4">
                        {cart?.items?.map(item => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                            >

                                {/* Product Info */}
                                <div>
                                    <h2 className="font-semibold">{item.product.name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ${item.product.price}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.product.id)}
                                    className="mt-3 sm:mt-0 text-red-500 hover:underline"
                                >
                                    Remove
                                </button>

                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-fit">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>

                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>${total}</span>
                        </div>

                        <button
                            className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg"
                        >
                            Proceed to Checkout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
