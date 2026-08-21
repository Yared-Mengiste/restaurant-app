import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';

export default function Index({ products }) {
    return (
        <AppLayout>
            <Head title="My Favorites" />

            <main className="pt-20 md:pt-32 pb-40 px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
                {/* HEADER */}
                <header className="mb-12 md:mb-20">
                    <h1 className="font-headline text-3xl sm:text-4xl lg:text-6xl text-on-surface font-light tracking-tight mb-4">
                        Saved for Later
                    </h1>
                    <p className="font-body text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">favorite</span>
                        Your personal selection of signature dishes.
                    </p>
                </header>

                {products.length > 0 ? (
                    /* PRODUCT GRID */
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 md:gap-y-16">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-outline-variant/30 rounded-3xl bg-surface-container-low">
                        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                                heart_broken
                            </span>
                        </div>
                        <h2 className="text-2xl font-headline text-on-surface mb-2">No favorites yet</h2>
                        <p className="text-on-surface-variant max-w-xs mb-8">
                            Explore our menu and tap the heart icon to save the dishes you love.
                        </p>
                        <Link
                            href={route('home')}
                            className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                        >
                            Browse Menu
                        </Link>
                    </div>
                )}
            </main>
        </AppLayout>
    );
}
