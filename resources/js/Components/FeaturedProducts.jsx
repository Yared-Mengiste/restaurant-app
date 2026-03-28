import { Link } from '@inertiajs/react';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ products = [], auth }) {
    // 80/20 Rule: If no products are featured, don't show the section at all.
    if (products.length === 0) return null;

    return (
        <section className="py-12 px-6 md:px-12 max-w-[1920px] mx-auto overflow-hidden">
            {/* SECTION HEADER */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <h3 className="font-headline text-3xl text-white italic">Featured</h3>
                </div>

                <Link
                    href={route('home', { category_id: null })}
                    className="text-primary font-label uppercase tracking-widest text-xs font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
                >
                    View all
                    <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                </Link>
            </div>

            {/* RESPONSIVE CONTAINER: Scroll on mobile, Grid on desktop */}
            <div className="
                flex overflow-x-auto no-scrollbar gap-6 pb-8 -mx-6 px-6
                md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 md:gap-y-12 md:overflow-visible
                scroll-smooth
            ">
                {products.slice(0, 10).map((product) => (
                    /* MOBILE TWEAK: min-w-[280px] ensures the cards
                       don't shrink to zero width inside the flexbox.
                    */
                    <div key={product.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-0">
                        <ProductCard
                            product={product}
                            auth={auth}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
