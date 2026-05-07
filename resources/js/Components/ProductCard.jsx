import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Heart, Lock } from 'lucide-react'; // Import Lucide icons

export default function ProductCard({ product }) {
    const { auth } = usePage().props;
    const defaultImage = "/placeholder.jpg";

    const [isFavourited, setIsFavourited] = useState(!!product.is_favourited);

    useEffect(() => {
        setIsFavourited(!!product.is_favourited);
    }, [product.is_favourited]);

    const isArchived = product.is_available === 0 || product.is_available === false;

    const handleProductClick = (e) => {
        e.preventDefault();
        router.get(route('products.show', product.id));
    };

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        const previousState = isFavourited;
        setIsFavourited(!previousState);

        router.post(route('products.favorite', product.id), {}, {
            preserveScroll: true,
            onError: () => setIsFavourited(previousState),
        });
    };

    return (
        <Link
            href={route('products.show', product.id)}
            onClick={handleProductClick}
            className={`group cursor-pointer block w-full outline-none transition-all duration-500
                ${isArchived ? 'opacity-60 grayscale-[0.8]' : 'hover:translate-y-[-4px]'}`}
        >
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-5 bg-surface-container-high shadow-lg border border-white/5">
                <img
                    alt={product.name}
                    src={(product?.image ? `/storage/products/${product.image}` : defaultImage)}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => { e.target.src = defaultImage; }}
                />

                {/* HEART BUTTON */}
                {(!auth.user || auth.user.role !== 'admin') && !isArchived && (
                    <button
                        onClick={toggleFavorite}
                        className="absolute top-3 right-3 md:top-5 md:right-5 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 text-white transition-all hover:bg-white hover:text-primary active:scale-90"
                    >
                        {/* 80/20 Rule: Use 'fill' prop for the active state */}
                        <Heart
                            size={22}
                            className="transition-all duration-300"
                            fill={isFavourited ? "currentColor" : "none"}
                        />
                    </button>
                )}

                {/* Status Badges */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2">
                    {product.is_featured && !isArchived && (
                        <span className="bg-primary/90 text-background text-[8px] md:text-[10px] px-2 md:px-2.5 py-1 md:py-1.5 rounded-sm font-label font-bold uppercase tracking-[0.15em] backdrop-blur-sm shadow-xl">
                            Chef's Choice
                        </span>
                    )}

                    {isArchived && (
                        <span className="bg-error/80 text-white text-[8px] md:text-[10px] px-2 md:px-2.5 py-1 md:py-1.5 rounded-sm font-label font-bold uppercase tracking-[0.15em] backdrop-blur-sm border border-white/10">
                            Archived
                        </span>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* CONTENT SECTION */}
            <div className="flex justify-between items-start px-1">
                <div className="flex flex-col gap-0.5 md:gap-1 max-w-[70%]">
                    <h3 className={`font-headline text-base md:text-lg italic transition-colors duration-300 truncate
                        ${isArchived ? 'text-on-surface-variant' : 'text-on-surface group-hover:text-primary'}`}>
                        {product.name}
                    </h3>
                    <p className="text-[9px] md:text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">
                        {product.category?.name || 'Main Course'}
                    </p>
                </div>

                <div className="text-right shrink-0">
                    <span className={`font-body text-sm md:text-base font-bold transition-colors
                        ${isArchived ? 'text-on-surface-variant/40' : 'text-primary'}`}>
                        ${Number(product.price).toFixed(2)}
                    </span>
                    {product.has_variants && (
                        <p className="text-[8px] md:text-[9px] text-on-surface-variant/40 uppercase tracking-tighter">
                            Starts at
                        </p>
                    )}
                </div>
            </div>

            {/* Admin Quick Indicator */}
            {auth.user?.role === 'admin' && isArchived && (
                <p className="mt-2 text-[8px] font-label uppercase tracking-widest text-error font-bold flex items-center gap-1">
                    <Lock size={10} />
                    Hidden from customers
                </p>
            )}
        </Link>
    );
}
