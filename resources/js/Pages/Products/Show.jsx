import { useState } from 'react';
import { usePage, Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ product, relatedProducts }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        product_variant_id: product.has_variants && product.variants.length > 0 ? product.variants[0].id : null,
        quantity: 1,
    });

    const [selectedVariant, setSelectedVariant] = useState(
        product.has_variants && product.variants.length > 0 ? product.variants[0] : null
    );

    const unitPrice = selectedVariant ? selectedVariant.price : product.price;

    const handleAddToCart = () => {
        post(route('cart.store'), {
            preserveScroll: true,
            onSuccess: () => setData('quantity', 1),
        });
    };

    const toggleAvailability = () => {
        if (confirm(`Are you sure you want to ${product.is_available ? 'archive' : 'restore'} this product?`)) {
            router.patch(route('admin.products.toggle', product.id), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title={product.name} />
            <main className="min-h-screen pt-32 pb-40 px-6 md:px-12 max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Image Section */}
                    <div className="w-full lg:w-3/5 relative">
                        <div className="sticky top-32">
                            <div className={`aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low shadow-2xl transition-opacity duration-500 ${!product.is_available ? 'opacity-40 grayscale' : ''}`}>
                                <img
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    src={(product?.image ? `/storage/products/${product.image}` : null)}
                                />
                            </div>
                            {!product.is_available && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/60 backdrop-blur-md text-white px-8 py-3 rounded-full font-label text-xs uppercase tracking-[0.3em] border border-white/20">
                                        Currently Archived
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-2/5 flex flex-col gap-10">
                        <section>
                            {/* ADMIN ACTION BAR */}
                            {auth.user?.role === 'admin' && (
                                <div className="mb-8 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <Link
                                        href={route('products.edit', product.id)}
                                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-label text-[10px] uppercase font-bold tracking-[0.15em] hover:scale-105 transition-transform shadow-lg"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Edit
                                    </Link>

                                    <button
                                        onClick={toggleAvailability}
                                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-label text-[10px] uppercase font-bold tracking-[0.15em] transition-all border shadow-lg ${
                                            product.is_available
                                                ? 'border-error/30 text-error hover:bg-error hover:text-white'
                                                : 'border-primary/30 text-primary hover:bg-primary hover:text-black'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {product.is_available ? 'archive' : 'unarchive'}
                                        </span>
                                        {product.is_available ? 'Archive Product' : 'Restore Product'}
                                    </button>
                                </div>
                            )}

                            <h1 className="font-headline text-5xl md:text-6xl text-on-surface mb-6 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-headline text-primary">
                                    ${Number(unitPrice).toFixed(2)}
                                </span>
                            </div>
                            <p className="mt-6 text-on-surface-variant font-body leading-relaxed max-w-prose">
                                {product.description}
                            </p>
                        </section>

                        {/* Variants Selection - Disabled if archived */}
                        {product.has_variants && product.variants.length > 0 && (
                            <section className={`space-y-6 transition-opacity ${!product.is_available ? 'opacity-50 pointer-events-none' : ''}`}>
                                <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                                    Select Variant
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            disabled={!product.is_available}
                                            onClick={() => {
                                                setSelectedVariant(variant);
                                                setData('product_variant_id', variant.id);
                                            }}
                                            className={`px-8 py-3 rounded-full border transition-all text-[10px] uppercase font-bold tracking-widest ${
                                                data.product_variant_id === variant.id
                                                    ? 'border-primary text-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                                                    : 'border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60'
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

            {/* Floating Bar Logic */}
            {auth.user && auth.user.role !== 'admin' && (
                <div className="fixed bottom-24 md:bottom-12 left-0 w-full z-40 px-4 md:px-6 pointer-events-none">
                    <div className="max-w-4xl mx-auto pointer-events-auto">
                        {product.is_available ? (
                            /* ACTIVE: Add to Cart Bar */
                            <div className="bg-[#111316]/95 rounded-full p-2 flex items-center justify-between backdrop-blur-xl border border-outline-variant/20 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                                <div className="flex items-center gap-8 pl-10">
                                    <div className="flex flex-col">
                                        <span className="text-lg md:text-2xl font-headline text-primary">
                                            ${(Number(unitPrice) * data.quantity).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                            className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface"
                                        >
                                            <span className="material-symbols-outlined">remove</span>
                                        </button>
                                        <span className="text-xl w-6 text-center font-headline text-on-surface">{data.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setData('quantity', data.quantity + 1)}
                                            className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface"
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={processing}
                                    onClick={handleAddToCart}
                                    className={`h-14 md:h-16 px-8 md:px-12 flex items-center justify-center gap-3 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-black
                                                  bg-gradient-to-r from-primary to-primary-container rounded-full shadow-lg transition-all
                                    ${processing ? 'opacity-70 cursor-wait' : 'hover:scale-105 active:scale-95'}
                                    `}
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2 font-bold">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Adding
                                        </span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                                            <span>Add to Cart</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            /* ARCHIVED: Unavailable Message */
                            <div className="bg-surface-container-highest/60 rounded-full py-5 px-10 text-center backdrop-blur-xl border border-outline-variant/20 shadow-xl animate-in fade-in duration-700">
                                <span className="font-label text-[10px] uppercase tracking-[0.4em] text-on-surface-variant font-extrabold">
                                    Item Currently Archived by Restaurant
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
