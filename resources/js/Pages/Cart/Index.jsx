import React from 'react';
import {Head, router, useForm} from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CartIndex({ cart, summary, auth }) {
    // Form helper for quantity updates and removals
    const { delete: destroy } = useForm();

    const handleUpdateQuantity = (productId, variantId, quantity) => {
        if (quantity < 1) return;

        // 2. Use router.put instead of form.put
        // Signature: router.put(url, data, options)
        router.put(route('cart.update'), {
            product_id: productId,
            product_variant_id: variantId,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => console.log("Updated successfully!"),
        });
    };

    const handleRemove = (productId, variantId) => {
        destroy(route('cart.destroy', {
            product_id: productId,
            product_variant_id: variantId
        }));
    };

    return (
        <AppLayout >
            <Head title="Your Selection" />

            <main className="pt-32 pb-40 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* LEFT COLUMN: ITEMS */}
                    <div className="lg:col-span-7 space-y-12">
                        <header>
                            <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-light tracking-tight mb-4">
                                Your Selection
                            </h1>
                            <p className="font-body text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                Your cart is saved and will persist for your next visit.
                            </p>
                        </header>

                        <div className="space-y-8">
                            {cart?.items.map((item) => (
                                <div key={item.id} className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl transition-all hover:bg-surface-container-low">
                                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.product.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi3x-L9FGX8iG2cHJeJlnwXcimb3L1ze39R-vEbo9vFRMlEW2botG8osQkOvXdImwez0DSdzC4XH7wD8Pi1haoTAONLWz1eaWsH-SPz4z4tEK0meQkhoW7rNFehCzAg3_M-eWe4ySYCxqepiPAgsb_yDTS_fWAI2KgRVsShXcR-e8PZstdsMh2LnJFrfkKgQ2rzN-mJ23MLyuCGxeR2TzxY69Pjw8-dD6509z3m2q7vN5rvngAnJbjyuxKHuPkIsHKmmKBDh5Qtyw9'}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-headline text-on-surface">
                                                    {item.product.name}
                                                </h3>
                                                {item.variant && (
                                                    <p className="text-on-surface-variant text-sm mt-1 uppercase tracking-widest font-bold">
                                                        {item.variant.name}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="font-headline text-xl text-primary">
                                                ${item.variant ? item.variant.price : item.product.price}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* QUANTITY CONTROLS */}
                                            <div className="flex items-center gap-4 bg-surface-container-highest px-4 py-2 rounded-full border border-outline-variant/20">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.product_variant_id, item.quantity - 1)}
                                                    className="text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">remove</span>
                                                </button>
                                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.product_variant_id, item.quantity + 1)}
                                                    className="text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">add</span>
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.product_id, item.product_variant_id)}
                                                className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-xs uppercase tracking-tighter"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!cart || cart.items.length === 0) && (
                                <p className="text-center py-12 text-on-surface-variant italic">Your cart is empty.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <aside className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
                                <h2 className="font-headline text-3xl mb-8">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-on-surface-variant font-medium">Subtotal</span>
                                        <span className="font-headline text-lg">${summary.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-on-surface-variant font-medium">Delivery Fee</span>
                                        <span className="font-headline text-lg">${summary.delivery_fee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-on-surface-variant font-medium">Service Charge (5%)</span>
                                        <span className="font-headline text-lg">${summary.service_charge.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                                        <span className="text-on-surface text-xl font-headline">Total</span>
                                        <span className="text-primary text-3xl font-headline font-bold">
                                            ${summary.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full py-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold uppercase tracking-[0.2em] text-sm hover:brightness-110 transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(248,201,39,0.2)]">
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </AppLayout>
    );
}
