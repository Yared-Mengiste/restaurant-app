import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function PaymentFailed() {
    return (
        <AppLayout>
            <Head title="Payment Failed" />

            <main className="min-h-screen flex items-center justify-center pt-32 pb-40 px-6">
                <div className="max-w-md w-full bg-surface-container-low rounded-3xl p-8 md:p-12 text-center border border-outline-variant/10 shadow-lg">

                    {/* Error Icon */}
                    <div className="mx-auto w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-8">
                        <span className="material-symbols-outlined text-error text-5xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                            error
                        </span>
                    </div>

                    <h1 className="font-headline text-4xl text-on-surface mb-4">
                        Payment Failed
                    </h1>

                    <p className="text-on-surface-variant font-body mb-8">
                        Something went wrong while processing your transaction with Chapa. Please try again.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href={route('cart.index')}
                            className="block w-full py-4 rounded-full bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all active:scale-95"
                        >
                            Return to Cart
                        </Link>

                        <Link
                            href={route('home')}
                            className="block w-full py-4 rounded-full border border-outline text-on-surface font-bold uppercase tracking-widest text-xs hover:bg-surface-container-high transition-all active:scale-95"
                        >
                            Cancel and Browse Menu
                        </Link>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
