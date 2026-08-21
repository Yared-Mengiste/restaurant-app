import { useRef } from 'react';
import ProductCard from './ProductCard';
import Icon from './Icon';

export default function FeaturedProducts({ products = [], auth }) {
    const scrollRef = useRef(null);

    if (products.length === 0) return null;

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            // Scroll by roughly 70% of the visible width
            const scrollAmount = clientWidth * 0.7;

            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-12 px-6 md:px-12 max-w-[1920px] mx-auto overflow-hidden group">
            {/* HEADER with Navigation Buttons */}
            <div className="flex justify-between items-end mb-10">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                        <h3 className="font-headline text-3xl text-on-surface italic">Chef's Specials</h3>
                        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mt-1">
                            Signature dishes from our kitchen
                        </p>
                    </div>
                </div>

                {/* NAVIGATION BUTTONS (Visible on Desktop) */}
                <div className="hidden md:flex gap-3">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-white/60 hover:border-primary hover:text-primary transition-all active:scale-90"
                    >
                        <Icon name="chevron_left" className=" text-xl" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-white/60 hover:border-primary hover:text-primary transition-all active:scale-90"
                    >
                        <Icon name="chevron_right" className=" text-xl" />
                    </button>
                </div>
            </div>

            {/* HORIZONTAL SCROLL CONTAINER */}
            <div
                ref={scrollRef}
                className="
                    flex overflow-x-auto no-scrollbar gap-6 pb-8
                    -mx-6 px-6 md:mx-0 md:px-0
                    scroll-smooth snap-x snap-mandatory
                "
            >
                {products.slice(0, 10).map((product) => (
                    <div
                        key={product.id}
                        className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] snap-start"
                    >
                        <ProductCard
                            product={product}
                            auth={auth}
                        />
                    </div>
                ))}
            </div>

            {/* MOBILE ONLY "SWIPE" HINT */}
            <div className="md:hidden flex justify-center mt-2 opacity-50">
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                </div>
            </div>
        </section>
    );
}
