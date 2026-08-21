import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function OrderSuccess({ orderId }) {
    return (
        <AppLayout>
            <Head title="Order Confirmed" />

            <main className="pt-20 md:pt-32 pb-40 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-8 animate-bounce">
                    <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                </div>

                <h1 className="font-headline text-3xl sm:text-4xl lg:text-6xl mb-4 text-on-surface">
                    Order Confirmed!
                </h1>

                <p className="text-on-surface-variant text-lg max-w-md mb-8">
                    Thank you for your purchase. Your order <span className="font-bold text-primary">#{orderId}</span> has been placed successfully and is being prepared.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href={route('home')} // Adjust to your menu/home route
                        className="px-8 py-4 rounded-full bg-primary text-on-primary font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                    >
                        Order More
                    </Link>
                    <Link
                        href="/"
                        className="px-8 py-4 rounded-full border border-outline text-on-surface font-bold uppercase text-xs tracking-widest hover:bg-surface-container-low transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
        </AppLayout>
    );
}
