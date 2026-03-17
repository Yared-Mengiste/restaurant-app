import AuthenticatedLayout from '@/Layouts/AppLayout.jsx';
import { Head, router } from '@inertiajs/react';

export default function Cart({ cart, total }) {

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        router.put('/cart', { product_id: productId, quantity });
    };

    const removeItem = (productId) => {
        router.delete('/cart', { product_id: productId });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Your Cart
                </h2>
            }
        >
            <Head title="Cart" />

            <div className="grid md:grid-cols-3 gap-6">

                {/* Items */}
                <div className="md:col-span-2 space-y-4">
                    {cart?.items?.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">
                            Your cart is empty.
                        </p>
                    )}

                    {cart?.items?.map(item => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                        >
                            <div>
                                <h2 className="font-semibold">
                                    {item.product.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    ${item.product.price}
                                </p>
                            </div>

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

                            <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-red-500 mt-3 sm:mt-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-fit">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>

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
        </AuthenticatedLayout>
    );
}
