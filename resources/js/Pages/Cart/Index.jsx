import { router } from '@inertiajs/react';

export default function Cart({ cart, total }) {
    const updateQuantity = (productId, quantity) => {
        router.put('/cart', { product_id: productId, quantity });
    };

    const removeItem = (productId) => {
        router.delete('/cart', { product_id: productId });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Cart</h1>

            {cart?.items?.map(item => (
                <div key={item.id} className="flex justify-between mt-4">
                    <div>
                        {item.product.name} - ${item.product.price}
                    </div>

                    <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                            updateQuantity(item.product.id, e.target.value)
                        }
                    />

                    <button onClick={() => removeItem(item.product.id)}>
                        Remove
                    </button>
                </div>
            ))}

            <h2 className="mt-6 font-bold">Total: ${total}</h2>
        </div>
    );
}
