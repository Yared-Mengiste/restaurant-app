import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CartIndex({ cart, summary }) {
    const { delete: destroy } = useForm();

    const handleUpdateQuantity = (productId, variantId, quantity) => {
        if (quantity < 1) return;
        router.put(route('cart.update'), {
            product_id: productId,
            product_variant_id: variantId,
            quantity: quantity
        }, { preserveScroll: true });
    };

    const handleRemove = (productId, variantId) => {
        destroy(route('cart.destroy', {
            product_id: productId,
            product_variant_id: variantId
        }));
    };
    const handleCheckout = () => {
        // We use router.post to hit the PaymentController@pay method
        router.post(route('payment.pay'), {}, {
            onBefore: () => {
                // Optional: You could add a loading state here
                console.log("Initializing payment...");
            },
            onError: (errors) => {
                console.error("Payment failed to initialize", errors);
            }
        });
    };

    // --- NEW FUNCTIONALITY ---
    const handleUpdateDeliveryType = (type) => {
        // Prevent unnecessary requests if already selected
        if (summary.delivery_type === type) return;

        router.post(route('cart.update-delivery-type'), {
            type: type
        }, {
            preserveScroll: true,
            onSuccess: () => console.log(`Switched to ${type}`)
        });
    };

    return (
        <AppLayout>
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
                                    {/* ... Item Image and Info ... */}
                                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.product.image_url || '/placeholder.png'} alt={item.product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-headline text-on-surface">{item.product.name}</h3>
                                                {item.variant && <p className="text-on-surface-variant text-sm mt-1 uppercase tracking-widest font-bold">{item.variant.name}</p>}
                                            </div>
                                            <span className="font-headline text-xl text-primary">${item.variant ? item.variant.price : item.product.price}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-4 bg-surface-container-highest px-4 py-2 rounded-full border border-outline-variant/20">
                                                <button onClick={() => handleUpdateQuantity(item.product_id, item.product_variant_id, item.quantity - 1)} className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">remove</span></button>
                                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item.product_id, item.product_variant_id, item.quantity + 1)} className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">add</span></button>
                                            </div>
                                            <button onClick={() => handleRemove(item.product_id, item.product_variant_id)} className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-xs uppercase tracking-tighter"><span className="material-symbols-outlined text-sm">delete</span>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SERVICE METHOD TOGGLE */}
                        <div className="pt-12 border-t border-outline-variant/10">
                            <h2 className="font-headline text-3xl mb-8">Service Method</h2>
                            <div className="bg-surface-container-low p-2 rounded-full max-w-md flex">
                                <button
                                    onClick={() => handleUpdateDeliveryType('pickup')}
                                    className={`flex-1 py-3 px-6 rounded-full font-bold uppercase text-xs tracking-widest transition-all ${summary.delivery_type === 'pickup' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                                >
                                    Pickup
                                </button>
                                <button
                                    onClick={() => handleUpdateDeliveryType('delivery')}
                                    className={`flex-1 py-3 px-6 rounded-full font-bold uppercase text-xs tracking-widest transition-all ${summary.delivery_type === 'delivery' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                                >
                                    Delivery
                                </button>
                            </div>

                            {/* Conditional Map View */}
                            {summary.delivery_type === 'delivery' && (
                                <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-headline text-xl">Address Selection</h3>
                                        <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">add_location</span> Add New
                                        </button>
                                    </div>
                                    <div className="relative w-full h-[300px] rounded-xl overflow-hidden grayscale contrast-125 brightness-75 border border-outline-variant/30">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
                                        <div className="absolute inset-0 bg-background/20"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <span className="material-symbols-outlined text-primary text-5xl drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                        </div>
                                        <div className="absolute bottom-6 left-6 right-6 bg-surface-container-highest/90 backdrop-blur-md p-4 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-xs uppercase font-bold text-primary tracking-widest mb-1">Active Address</p>
                                                <p className="text-sm font-semibold">12 Rue de l'Amiral de Coligny, Paris</p>
                                            </div>
                                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        </div>
                                    </div>
                                </div>
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
                                        <span className="text-primary text-3xl font-headline font-bold">${summary.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={!cart || cart.items.length === 0}
                                    className="w-full py-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold uppercase tracking-[0.2em] text-sm shadow-[0_10px_30px_rgba(248,201,39,0.2)] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
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
