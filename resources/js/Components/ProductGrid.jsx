import ProductCard from './ProductCard';

export default function ProductGrid({ products, auth, title = "Our Menu" }) {
    return (
        <section className="py-12 px-6 md:px-12 max-w-[1920px] mx-auto min-h-[400px]">
            {/* GRID HEADER */}
            <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-outline-variant/30"></div>
                <h3 className="font-label text-xs font-bold uppercase tracking-[0.4em] text-on-surface-variant/50 whitespace-nowrap">
                    {title}
                </h3>
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-outline-variant/30"></div>
            </div>

            {/* PRODUCT MAPPING */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            auth={auth}
                        />
                    ))}
                </div>
            ) : (
                /* EMPTY STATE: Editorial Style */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="material-symbols-outlined text-4xl text-primary/30 mb-4 font-light">
                        restaurant_menu
                    </span>
                    <h4 className="font-headline text-2xl italic text-on-surface-variant mb-2">
                        A Rare Absence
                    </h4>
                    <p className="text-on-surface-variant/60 max-w-xs text-sm leading-relaxed">
                        We couldn't find any delicacies matching your current selection.
                        Please try adjusting your filters.
                    </p>
                </div>
            )}
        </section>
    );
}
