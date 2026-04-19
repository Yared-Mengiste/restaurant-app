import { Link, usePage, router, Head } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment } from 'react';
import { Menu, Transition, Dialog } from '@headlessui/react'; // Added Dialog

export default function AdminProductLayout({ product, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for modal
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        const darkModeEnabled = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(darkModeEnabled);
        if (darkModeEnabled) document.documentElement.classList.add('dark');
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        document.documentElement.classList.toggle('dark', newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
    };

    // Modified function to just open the modal
    const handleToggleClick = () => {
        setIsConfirmOpen(true);
    };

    // The actual execution logic
    const confirmToggle = () => {
        router.patch(route('admin.products.toggle', product.id), {}, {
            preserveScroll: true,
            onSuccess: () => setIsConfirmOpen(false)
        });
    };

    return (
        <div className="min-h-screen bg-background text-on-surface font-body transition-colors duration-300">
            <Head title={`Admin - ${product.name}`} />

            {/* ... NAVBAR REMAINS THE SAME ... */}
            <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b-2 border-secondary/30">
                <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-[1920px] mx-auto">
                    <div className="flex items-center gap-8">
                        <Link href={route('admin.dashboard')} className="text-2xl md:text-3xl font-serif italic text-primary tracking-tight">
                            Bello <span className="text-secondary not-italic font-sans text-xs tracking-[0.3em] uppercase block">Admin</span>
                        </Link>
                    </div>
                    {/* ... Profile / Theme Toggle ... */}
                    <div className="flex items-center gap-6">
                        <button onClick={toggleTheme} className="hidden md:flex material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-2">
                            {isDark ? 'light_mode' : 'dark_mode'}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="min-h-screen pt-12 pb-40 px-6 md:px-12 max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 lg:sticky lg:top-32">
                        <div className={`aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container-low shadow-2xl transition-all duration-500 ${!product.is_available ? 'opacity-40 grayscale blur-[2px]' : ''}`}>
                            <img src={product?.image ? `/storage/products/${product.image}` : '/placeholder.jpg'} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-10">
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-4">
                                <Link href={route('admin.products.edit', product.id)} className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl">
                                    Edit Product
                                </Link>
                                <button
                                    onClick={handleToggleClick} // Trigger modal instead of confirm()
                                    className={`px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] border-2 transition-all ${
                                        product.is_available ? 'border-error text-error hover:bg-error/5' : 'border-green-500 text-green-500 hover:bg-green-500/5'
                                    }`}
                                >
                                    {product.is_available ? 'Archive Item' : 'Restore Item'}
                                </button>
                            </div>
                            {/* ... Title & Description ... */}
                            <h1 className="font-headline text-5xl md:text-6xl text-on-surface mb-4 leading-tight">{product.name}</h1>
                            <p className="text-on-surface-variant leading-loose text-lg">{product.description}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- CUSTOM CONFIRMATION MODAL --- */}
            <Transition show={isConfirmOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setIsConfirmOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-surface-container-high p-8 text-left align-middle shadow-2xl transition-all border border-outline-variant/10">
                                    <Dialog.Title as="h3" className="font-headline text-2xl text-on-surface mb-2">
                                        Confirm Action
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-on-surface-variant leading-relaxed">
                                            Are you sure you want to <span className="font-bold text-primary">{product.is_available ? 'archive' : 'restore'}</span> "{product.name}"?
                                            {product.is_available ? " It will be hidden from the public menu." : " It will become visible to customers again."}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <button
                                            type="button"
                                            className="flex-1 bg-surface-container-highest text-on-surface px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-outline-variant/20 transition-colors"
                                            onClick={() => setIsConfirmOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className={`flex-1 px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest text-white shadow-lg transition-transform active:scale-95 ${
                                                product.is_available ? 'bg-error shadow-error/20' : 'bg-green-600 shadow-green-600/20'
                                            }`}
                                            onClick={confirmToggle}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* ... MOBILE NAV ... */}
            <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full border border-outline-variant/20 flex justify-around items-center py-4 px-4 bg-background/80 backdrop-blur-xl z-50 shadow-2xl">
                <Link href={route('admin.dashboard')} className="flex flex-col items-center text-on-surface/40">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-[8px] uppercase font-bold mt-1 tracking-tighter">Dash</span>
                </Link>
                <Link href={route('admin.products')} className="flex flex-col items-center text-primary">
                    <span className="material-symbols-outlined">inventory_2</span>
                    <span className="text-[8px] uppercase font-bold mt-1 tracking-tighter">Products</span>
                </Link>
                <Link href={route('admin.categories.index')} className="flex flex-col items-center text-on-surface/40">
                    <span className="material-symbols-outlined">category</span>
                    <span className="text-[8px] uppercase font-bold mt-1 tracking-tighter">Cats</span>
                </Link>
            </nav>

        </div>
    );
}
