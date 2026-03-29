import { Link, router } from '@inertiajs/react';

export default function AdminProductCard({ product }) {
    const defaultImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBixsKQpMDnDqNYWkE_TS9GzIVGy9k8VszLKdiI-fZR0HcPit6KuaHSPSTa6H1_rK45Dku9CV0JTIJawfs2cqLdwB1VP2-0PGAvITdOKYJ_tRJ0M37YVKOzdiuNHJrtYIun7TybxrGQsATCpuEWp5_--RjZDounDkvnsJOG6BxStm1S6fAPUW4LHUaKhpnbNifLv7zlY8bdZnyauXLQ_7ljsD_9O-JSlC3pUh0yaesFwhw_WJ0liMxkO2YwcKZwR3cSmkNsEbM9wF3P";

    const handleProductClick = (e) => {
        e.preventDefault();
        // Simply route to the product show page regardless of auth status
        router.get(route('admin.show', product.id));
    };

    return (
        <Link
            href={route('products.show', product.id)}
            onClick={handleProductClick}
            className="group cursor-pointer block w-full outline-none transition-all duration-300"
        >
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-5 bg-surface-container-high shadow-lg border border-white/5">
                <img
                    alt={product.name}
                    src={product.image || defaultImage}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => { e.target.src = defaultImage; }}
                />

                {product.is_featured && (
                    <div className="absolute top-2 left-2 md:top-4 md:left-4">
                        <span className="bg-primary/90 text-background text-[8px] md:text-[10px] px-2 md:px-2.5 py-1 md:py-1.5 rounded-sm font-label font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] backdrop-blur-sm">
                            Chef's Choice
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* CONTENT SECTION */}
            <div className="flex justify-between items-start px-1">
                <div className="flex flex-col gap-0.5 md:gap-1 max-w-[70%]">
                    <h3 className="font-headline text-base md:text-lg italic text-on-surface group-hover:text-primary transition-colors duration-300 truncate">
                        {product.name}
                    </h3>
                    <p className="text-[9px] md:text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">
                        {product.category?.name || 'Main Course'}
                    </p>
                </div>

                <div className="text-right shrink-0">
                    <span className="font-body text-sm md:text-base text-primary font-bold">
                        ${Number(product.price).toFixed(2)}
                    </span>
                    {product.has_variants? (
                        <p className="text-[8px] md:text-[9px] text-on-surface-variant/40 uppercase tracking-tighter">
                            Starts at
                        </p>
                    ): ''}
                </div>
            </div>
        </Link>
    );
}
