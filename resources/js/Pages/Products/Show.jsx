import { useState } from 'react';
import { usePage, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';

export default function Show({ product, relatedProducts, cart }) {
    const { auth } = usePage().props;

    // State for variants and quantity
    const [selectedVariant, setSelectedVariant] = useState(
        product.has_variants && product.variants.length > 0 ? product.variants[0] : null
    );
    const [quantity, setQuantity] = useState(1);
    const [instructions, setInstructions] = useState('');

    // Dynamic Price Calculation
    const unitPrice = selectedVariant ? selectedVariant.price : product.price;

    // 80/20 Rule: Local subtotal for better UX.
    // We multiply the unit price by current quantity.
    const dynamicSubtotal = Number(unitPrice) * quantity;

    const handleAddToCart = () => {
        console.log({
            product_id: product.id,
            variant_id: selectedVariant?.id,
            quantity,
            instructions,
            total_price: dynamicSubtotal
        });
    };

    return (
        <AppLayout>
            <Head title={product.name} />

            <main className="min-h-screen pt-32 pb-40 px-6 md:px-12 max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Product Image Section */}
                    <div className="w-full lg:w-3/5 relative">
                        <div className="sticky top-32">
                            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low">
                                <img
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    src={product.image}
                                />
                            </div>
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 border-outline-variant/20 border-r border-b rounded-br-xl hidden lg:block"></div>
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="w-full lg:w-2/5 flex flex-col gap-10">
                        <section>
                            <span className="font-label text-sm uppercase tracking-[0.2em] text-primary mb-4 block">
                                {product.category?.name || "Chef's Selection"}
                            </span>
                            <h1 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight mb-6">
                                {product.name}
                            </h1>
                            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-xl">
                                {product.description}
                            </p>
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-headline text-primary">
                                    ${Number(unitPrice).toFixed(2)}
                                </span>
                            </div>
                        </section>

                        {/* Variants Selection */}
                        {product.has_variants && product.variants.length > 0 && (
                            <section className="space-y-6">
                                <h3 className="font-label text-xs uppercase tracking-widest text-on-surface/50">
                                    Select Preference
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-8 py-3 rounded-full border font-label text-sm uppercase tracking-wider transition-all ${
                                                selectedVariant?.id === variant.id
                                                    ? 'border-primary text-primary bg-primary/5'
                                                    : 'border-outline-variant/30 text-on-surface/70 hover:bg-surface-container-highest'
                                            }`}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Special Instructions */}

                    </div>
                </div>

                {/* Related Items */}
                {relatedProducts.length > 0 && (
                    <section className="mt-32">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="font-headline text-4xl text-on-surface">Suggestion</h2>
                                <p className="text-on-surface-variant mt-2 font-body italic">
                                    Sommelier-selected for your {product.name}.
                                </p>
                            </div>
                            <div className="h-px flex-1 bg-outline-variant/10 mx-8 mb-4 hidden md:block"></div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Fixed Floating Order Bar */}
            {/* Fixed Floating Order Bar */}
            {auth.user && (
                <div className="fixed bottom-24 md:bottom-12 left-0 w-full z-40 px-4 md:px-6 pb-4 md:pb-10 pointer-events-none">
                    <div className="max-w-4xl mx-auto glassmorphism-border bg-[#111316]/95 rounded-full p-1.5 md:p-2 flex items-center justify-between pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-outline-variant/20 backdrop-blur-xl">

                        {/* Left Section: Price & Counter */}
                        <div className="flex items-center gap-3 md:gap-8 pl-4 md:pl-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-on-surface/50 font-label">Total</span>
                                <span className="text-lg md:text-2xl font-headline text-primary whitespace-nowrap">
                        ${dynamicSubtotal.toFixed(2)}
                    </span>
                            </div>

                            {/* Quantity Controls: Now visible on mobile, just tighter */}
                            <div className="flex items-center gap-2 md:gap-4 border-l border-outline-variant/30 pl-3 md:pl-8">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary transition-colors active:scale-90"
                                >
                                    <span className="material-symbols-outlined text-sm md:text-base">remove</span>
                                </button>
                                <span className="font-headline text-base md:text-xl w-4 md:w-6 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary transition-colors active:scale-90"
                                >
                                    <span className="material-symbols-outlined text-sm md:text-base">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Section: Add Button */}
                        <button
                            onClick={handleAddToCart}
                            className="h-12 md:h-16 px-5 md:px-12 bg-gradient-to-r from-primary to-primary-container text-black font-label text-[10px] md:text-sm font-bold uppercase tracking-widest rounded-full hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 md:gap-3 shadow-lg shadow-primary/20"
                        >
                            <span className="hidden xs:inline">Add</span>
                            <span className="material-symbols-outlined text-lg md:text-xl">shopping_cart</span>
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
