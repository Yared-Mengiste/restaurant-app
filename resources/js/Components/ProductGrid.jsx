import ProductCard from './ProductCard';
import { Link } from '@inertiajs/react';

export default function ProductGrid({ products, auth, title = "Our Menu" }) {
    // Extract the actual product array from the pagination object
    const items = products.data;

    return (
        <section className="py-8 md:py-12 px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto min-h-[400px]" id="menu">
            {/* GRID HEADER */}
            <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-outline-variant/30"></div>
                <h3 className="font-label text-xs font-bold uppercase tracking-[0.4em] text-on-surface-variant/50 whitespace-nowrap">
                    {title}
                </h3>
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-outline-variant/30"></div>
            </div>

            {/* PRODUCT MAPPING */}
            {items.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-10 sm:gap-y-16">
                        {items.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                auth={auth}
                            />
                        ))}
                    </div>

                    {/* PAGINATION BUTTONS */}
                    <div className="mt-20 flex justify-center items-center gap-2">
                        {products.links.map((link, index) => {
                            // Fix: If no URL exists, render a span to prevent the 'toString' null error
                            if (!link.url) {
                                return (
                                    <span
                                        key={index}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="px-4 py-2 text-[10px] font-label uppercase tracking-widest rounded-full border border-outline-variant/10 opacity-30 cursor-not-allowed text-on-surface-variant/50"
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveScroll // Recommended for better UX
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`
                                        px-4 py-2 text-[10px] font-label uppercase tracking-widest transition-all rounded-full border
                                        ${link.active
                                        ? 'bg-primary text-on-primary border-primary font-bold shadow-lg'
                                        : 'bg-surface text-on-surface-variant border-outline-variant/20 hover:border-primary hover:text-primary'}
                                    `}
                                />
                            );
                        })}
                    </div>
                </>
            ) : (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="material-symbols-outlined text-4xl text-primary/30 mb-4 font-light">
                        restaurant_menu
                    </span>
                    <h4 className="font-headline text-2xl italic text-on-surface-variant mb-2">
                        A Rare Absence
                    </h4>
                    <p className="text-on-surface-variant/60 max-w-xs text-sm leading-relaxed">
                        We couldn't find any delicacies matching your current selection.
                    </p>
                </div>
            )}
        </section>
    );
}
