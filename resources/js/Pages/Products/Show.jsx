import { useState } from 'react';
import {usePage, Head, useForm, router} from '@inertiajs/react'; // Added useForm
import AppLayout from '@/Layouts/AppLayout';
import { formatCurrency } from '@/lib/currency';
import ProductCard from '@/Components/ProductCard';

export default function Show({ product, relatedProducts }) {
    const { auth } = usePage().props;

    // 1. Single source of truth for the form
    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        product_variant_id: product.has_variants && product.variants.length > 0 ? product.variants[0].id : null,
        quantity: 1,
    });

    // 2. Local UI state only for displaying the variant name/price easily
    const [selectedVariant, setSelectedVariant] = useState(
        product.has_variants && product.variants.length > 0 ? product.variants[0] : null
    );

    // Dynamic Price Calculation based on the single form state
    const unitPrice = selectedVariant ? selectedVariant.price : product.price;

    const handleAddToCart = () => {
        if (auth.user) {
            post(route('cart.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setData('quantity', 1);
                },
            });
        } else {
            // This actually moves the user to the login page
            router.visit(route('login'));
        }
    };

    return (
        <AppLayout>
            <Head title={product.name} />
            <main className="min-h-screen pt-20 md:pt-32 pb-44 px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-24">
                    {/* ... Image Section ... */}
                    <div className="w-full lg:w-3/5 relative">
                        <div className="sticky top-32">
                            <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low shadow-xl lg:shadow-2xl">
                                <img
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    src={(product?.image ? `/storage/products/${product.image}` : '/placeholder.jpg')}

                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/5 flex flex-col gap-10">
                        <section>
                            <h1 className="font-headline text-3xl sm:text-4xl lg:text-6xl text-on-surface mb-4 md:mb-6">
                                {product.name}
                            </h1>
                            <div className="mb-8">
                                <p className="text-on-surface/70 text-lg leading-relaxed max-w-xl">
                                    {product.description || "No description available for this item."}
                                </p>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-headline text-primary">
                                    {formatCurrency(unitPrice)}
                                </span>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2 text-xs">
                                {product.is_featured && <span className="rounded-full bg-primary/10 text-primary px-3 py-2 font-bold">Popular</span>}
                                {product.dietary_labels?.split(',').map((label) => <span key={label} className="rounded-full bg-tertiary/10 text-tertiary px-3 py-2 font-bold">{label.trim()}</span>)}
                                {!product.is_available && <span className="rounded-full bg-error/10 text-error px-3 py-2 font-bold">Unavailable</span>}
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                {product.portion && <div><span className="font-bold">Portion:</span> {product.portion}</div>}
                            </div>
                            {(product.ingredients || product.allergens) && <details className="mt-5 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"><summary className="cursor-pointer font-bold">Ingredients & allergens</summary><div className="pt-3 space-y-2 text-sm text-on-surface-variant">{product.ingredients && <p><span className="font-bold text-on-surface">Ingredients:</span> {product.ingredients}</p>}{product.allergens && <p className="text-error"><span className="font-bold">Allergens:</span> {product.allergens}</p>}</div></details>}
                        </section>

                        {/* Variants Selection */}
                        {product.has_variants && product.variants.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => {
                                                setSelectedVariant(variant);
                                                setData('product_variant_id', variant.id); // Updates the form
                                            }}
                                            className={`min-h-11 px-6 py-3 rounded-full border transition-all ${
                                                data.product_variant_id === variant.id
                                                    ? 'border-primary text-primary bg-primary/5'
                                                    : 'border-outline-variant/30 text-on-surface/70'
                                            }`}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            {/* Fixed Floating Order Bar */}
            <div className="fixed bottom-20 md:bottom-12 left-0 w-full z-40 px-3 md:px-6 pointer-events-none">
                <div className="max-w-4xl mx-auto bg-surface-container-high/95 rounded-2xl md:rounded-full p-2 flex items-center justify-between gap-2 pointer-events-auto backdrop-blur-xl border border-outline-variant/20 shadow-2xl transition-colors duration-300">

                    <div className="flex items-center gap-2 sm:gap-4 md:gap-8 pl-2 sm:pl-4 md:pl-10 min-w-0">
                        {/* Total Price */}
                        <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-headline text-on-surface">
                    {formatCurrency(Number(unitPrice) * data.quantity)}
                </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <button aria-label="Decrease quantity"
                                type="button"
                                onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                className="touch-target rounded-full bg-surface-container-highest text-on-surface hover:bg-primary/20 transition-colors flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-sm md:text-base">remove</span>
                            </button>
                            <span className="text-lg md:text-xl w-6 text-center text-on-surface font-bold">{data.quantity}</span>
                            <button aria-label="Increase quantity"
                                type="button"
                                onClick={() => setData('quantity', data.quantity + 1)}
                                className="touch-target rounded-full bg-surface-container-highest text-on-surface hover:bg-primary/20 transition-colors flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-sm md:text-base">add</span>
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        disabled={processing || !product.is_available}
                        onClick={handleAddToCart}
                        className={`h-12 md:h-16 px-6 md:px-12 flex items-center justify-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest
                bg-primary text-on-primary rounded-xl md:rounded-full shadow-lg transition-all min-w-[116px]
                ${processing ? 'opacity-70 cursor-wait' : 'hover:scale-105 active:scale-95 shadow-primary/20'}
            `}
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-on-primary" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Adding...</span>
                </span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl md:text-2xl">shopping_cart</span>
                                <span>{product.is_available ? 'Add to Cart' : 'Unavailable'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
