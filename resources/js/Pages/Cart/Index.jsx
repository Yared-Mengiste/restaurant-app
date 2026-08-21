import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import AddressMapSelector from '../../Components/AddressMapSelector'; // Import the new component
import { formatCurrency } from '@/lib/currency';

export default function CartIndex({ cart, summary, userAddresses = [] }) {
    const { delete: destroy } = useForm();

    // UI States
    const [isProcessing, setIsProcessing] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [newAddressData, setNewAddressData] = useState(null);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [details, setDetails] = useState({
        phone: cart?.phone || '',
        order_notes: cart?.order_notes || '',
    });

    const handleDeleteAddress = (e, addressId) => {
        e.stopPropagation(); // Prevent selecting the address while trying to delete it

        setAddressToDelete(addressId);
    };

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

    // --- Address Selection Logic ---
    const handleSelectSavedAddress = (addressId) => {
        router.post(route('cart.update-address'), { address_id: addressId }, {
            preserveScroll: true
        });
    };

    const handleSaveNewAddress = () => {
        if (!newAddressData) return;

        router.post(route('addresses.store'), newAddressData, {
            onSuccess: (page) => {
                // Logic: The 'page' object contains the updated props from Laravel.
                // Find the latest address you just added to the userAddresses array
                const newAddress = page.props.userAddresses[0];

                // if (newAddress) {
                //     handleSelectSavedAddress(newAddress.id);
                // }

                setShowMap(false);
                setNewAddressData(null);
            }
        });
    };

    const handleUpdateDeliveryType = (type) => {
        if (summary.delivery_type === type) return;
        router.post(route('cart.update-delivery-type'), { type: type }, { preserveScroll: true });
    };

    const handleCheckout = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        if (!details.phone || (summary.delivery_type === 'delivery' && !cart.address_id)) {
            setValidationError(!details.phone ? 'Enter a phone number before checkout.' : 'Select a delivery address before checkout.');
            setIsProcessing(false);
            return;
        }
        setValidationError('');

        try {
            await axios.post(route('cart.update-checkout-details'), {
                ...details,
                delivery_type: summary.delivery_type,
                address_id: cart.address_id,
            });
            const response = await axios.post(route('payment.pay'));
            if (response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            } else {
                setIsProcessing(false);
            }
        } catch (error) {
            setIsProcessing(false);
            setValidationError(error.response?.data?.error || 'Failed to start payment. Please try again.');
        }
    };

    return (
        <AppLayout>
            <Head title="Your Selection" />

            <main className="pt-20 md:pt-32 pb-48 lg:pb-40 px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* LEFT COLUMN: ITEMS */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* ... (Existing Header and Cart Item Map) ... */}
                        <header>
                            <h1 className="font-headline text-3xl sm:text-4xl lg:text-6xl text-on-surface font-light tracking-tight mb-4">
                                Your Selection
                            </h1>
                            <p className="font-body text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                Your cart is saved and will persist for your next visit.
                            </p>
                        </header>

                        <div className="space-y-8">
                            {cart?.items.map((item) => (
                                <div key={`${item.product_id}-${item.product_variant_id}`} className="group flex gap-4 md:gap-6 p-3 sm:p-6 rounded-xl transition-all hover:bg-surface-container-low">
                                    <div className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={(item.product?.image ? `/storage/products/${item.product.image}` : '/placeholder.jpg')}

                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-headline text-on-surface">{item.product.name}</h3>
                                                {item.variant && (
                                                    <p className="text-on-surface-variant text-sm mt-1 uppercase tracking-widest font-bold">
                                                        {item.variant.name}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="font-headline text-xl text-primary">
                                                {formatCurrency(item.variant ? item.variant.price : item.product.price)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-4 bg-surface-container-highest px-4 py-2 rounded-full border border-outline-variant/20">
                                                <button aria-label={`Decrease ${item.product.name} quantity`}
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.product_variant_id, item.quantity - 1)}
                                                    className="touch-target text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">remove</span>
                                                </button>
                                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                                <button aria-label={`Increase ${item.product.name} quantity`}
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.product_variant_id, item.quantity + 1)}
                                                    className="touch-target text-on-surface-variant hover:text-primary transition-colors"
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

                            {summary.delivery_type === 'delivery' && (
                                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h3 className="font-headline text-xl">Delivery Address</h3>

                                    {/* Saved Addresses List */}
                                    {/* Saved Addresses List */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {userAddresses.map((addr) => (
                                            <div key={addr.id} className="relative group">
                                                <button
                                                    onClick={() => handleSelectSavedAddress(addr.id)}
                                                    className={`w-full p-4 md:p-5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                                        cart.address_id === addr.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-outline-variant/20 bg-surface-container-low active:bg-surface-container-high'
                                                    }`}
                                                >
                                                    {/*
                   Added 'pr-10': This creates a "safe zone" so the text
                   doesn't run into the delete icon on small screens.
                */}
                                                    <div className="flex-grow pr-10">
                                                        <p className="font-bold text-sm line-clamp-1">{addr.address_line}</p>
                                                        {addr.distance_km && (
                                                            <p className="text-xs text-on-surface-variant">
                                                                {addr.distance_km} km away
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center">
                                                        {cart.address_id === addr.id && (
                                                            <span className="material-symbols-outlined text-primary text-xl">
                            check_circle
                        </span>
                                                        )}
                                                    </div>
                                                </button>

                                                {/*
                MD:OPACITY-0: Hidden by default only on medium screens and up.
                GROUP-HOVER: Visible on hover for desktops.
                On mobile, it stays visible so the user knows they can delete.
            */}
                                                <button
                                                    onClick={(e) => handleDeleteAddress(e, addr.id)} aria-label={`Delete ${addr.address_line}`}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-on-surface-variant hover:text-error active:scale-90 transition-all md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                                    title="Delete Address"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Map Integration */}
                                    {!showMap ? (
                                        <button
                                            onClick={() => setShowMap(true)}
                                            className="w-full py-6 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">add_location</span>
                                            Add New Address via Map
                                        </button>
                                    ) : (
                                        <div className="bg-surface-container-high p-6 rounded-2xl space-y-6">
                                            <AddressMapSelector onAddressSelect={setNewAddressData} />
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleSaveNewAddress}
                                                    disabled={!newAddressData}
                                                    className="flex-1 py-4 bg-primary text-on-primary rounded-full font-bold uppercase text-xs tracking-widest disabled:opacity-50"
                                                >
                                                    Save This Location
                                                </button>
                                                <button
                                                    onClick={() => setShowMap(false)}
                                                    className="flex-1 py-4 bg-surface-container-highest rounded-full font-bold uppercase text-xs tracking-widest"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-10 border-t border-outline-variant/10 space-y-5">
                            <h2 className="font-headline text-3xl">Contact & order notes</h2>
                            <label className="block">
                                <span className="block text-xs font-bold uppercase tracking-widest mb-2">Phone number</span>
                                <input type="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} placeholder="+251 9..." className="w-full rounded-lg bg-background border border-outline-variant/30 px-4 py-3" />
                            </label>
                            {validationError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{validationError}</p>}
                            <label className="block">
                                <span className="block text-xs font-bold uppercase tracking-widest mb-2">Order notes</span>
                                <textarea value={details.order_notes} onChange={(e) => setDetails({ ...details, order_notes: e.target.value })} placeholder="Allergies, preparation requests, or delivery directions" rows="4" className="w-full rounded-lg bg-background border border-outline-variant/30 px-4 py-3" />
                            </label>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <aside className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-surface-container-low rounded-xl p-5 md:p-8 border border-outline-variant/10">
                                <button type="button" onClick={() => setShowSummary(!showSummary)} className="lg:pointer-events-none w-full flex items-center justify-between"><h2 className="font-headline text-2xl md:text-3xl lg:mb-8">Order Summary</h2><span className="lg:hidden material-symbols-outlined">{showSummary ? 'expand_less' : 'expand_more'}</span></button>
                                <div className={`${showSummary ? 'block' : 'hidden'} lg:block space-y-4 my-6 lg:mt-0 lg:mb-8`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-on-surface-variant font-medium">Subtotal</span>
                                        <span className="font-headline text-lg">{formatCurrency(summary.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-on-surface-variant font-medium">Delivery Fee</span>
                                        <span className="font-headline text-lg">{formatCurrency(summary.delivery_fee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-on-surface-variant font-medium text-xs uppercase tracking-tighter">Distance Charge</span>
                                        <span className="text-xs text-on-surface-variant italic">Included in delivery</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-on-surface-variant font-medium">Service Charge (5%)</span>
                                        <span className="font-headline text-lg">{formatCurrency(summary.service_charge)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                                        <span className="text-on-surface text-xl font-headline">Total</span>
                                        <span className="text-primary text-3xl font-headline font-bold">{formatCurrency(summary.total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing || !cart || cart.items.length === 0 || (summary.delivery_type === 'delivery' && !cart.address_id)}
                                    className={`hidden lg:block w-full py-6 rounded-full font-bold uppercase tracking-[0.2em] text-sm transition-all relative overflow-hidden
                                        ${isProcessing
                                        ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
                                        : 'bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_10px_30px_rgba(248,201,39,0.2)] hover:brightness-110 active:scale-[0.98]'
                                    }
                                        disabled:opacity-50`}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        {isProcessing ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                                <span>Connecting...</span>
                                            </>
                                        ) : (
                                            <span>Proceed to Payment</span>
                                        )}
                                    </div>
                                </button>
                                {summary.delivery_type === 'delivery' && !cart.address_id && (
                                    <p className="text-center text-error text-[10px] mt-4 uppercase tracking-widest font-bold">Please select an address</p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {addressToDelete && <div className="fixed inset-0 z-[80] bg-black/60 p-4 flex items-center justify-center"><div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl"><h2 className="font-headline text-2xl">Remove this address?</h2><p className="mt-2 text-sm text-on-surface-variant">You can add it again later from the map.</p><div className="mt-6 flex gap-3"><button onClick={() => setAddressToDelete(null)} className="min-h-11 flex-1 rounded-xl border border-outline-variant/30">Cancel</button><button onClick={() => router.delete(route('addresses.destroy', addressToDelete), { preserveScroll: true, onFinish: () => setAddressToDelete(null) })} className="min-h-11 flex-1 rounded-xl bg-error text-white">Remove</button></div></div></div>}

            <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40 px-3 pointer-events-none"><div className="max-w-md mx-auto rounded-2xl bg-surface-container-high/95 border border-outline-variant/20 shadow-2xl backdrop-blur-xl p-2 flex items-center justify-between gap-3 pointer-events-auto"><div className="pl-3"><p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Total</p><p className="font-headline text-lg text-primary">{formatCurrency(summary.total)}</p></div><button onClick={handleCheckout} disabled={isProcessing || !cart?.items?.length || (summary.delivery_type === 'delivery' && !cart.address_id)} className="min-h-12 px-6 rounded-xl bg-primary text-on-primary font-bold disabled:opacity-50">{isProcessing ? 'Connecting…' : 'Pay now'}</button></div></div>
        </AppLayout>
    );
}
