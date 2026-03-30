import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function ProductForm({ product = null, categories = [] }) {
    const isEditing = !!product;

    // Initialize form with existing product data or defaults [cite: 36, 37]
    const { data, setData, post, patch, processing, errors } = useForm({
        category_id: product?.category_id || '',
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        is_available: product?.is_available ?? true,
        is_featured: product?.is_featured ?? false,
        has_variants: product?.has_variants ?? false,
        image: null,
        variants: product?.variants || [{ name: '', price: '' }],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Laravel requires a POST with _method=PATCH to handle file uploads in an update
            post(route('admin.products.update', product.id));
        } else {
            post(route('admin.products.store'));
        }
    };

    // Helper to manage dynamic variant inputs [cite: 11, 30]
    const handleAddVariant = () => {
        setData('variants', [...data.variants, { name: '', price: '' }]);
        setData('has_variants', true);
    };

    const handleRemoveVariant = (index) => {
        const newVariants = data.variants.filter((_, i) => i !== index);
        setData('variants', newVariants);
        if (newVariants.length === 0) setData('has_variants', false);
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? `Edit ${product.name}` : 'New Entry'} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <Link
                        href={route('admin.products')}
                        className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] mb-4"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Catalogue
                    </Link>
                    <h1 className="font-headline text-5xl font-light text-on-surface tracking-tight">
                        {isEditing ? 'Refine' : 'New'} <span className="text-primary italic">{isEditing ? 'Detail' : 'Entry'}</span>
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
                {/* Left Column: Form Fields */}
                <div className="col-span-12 lg:col-span-7 space-y-8">
                    <div className="glass-panel p-10 rounded-xl border border-outline-variant/10 bg-surface-container-low shadow-2xl">

                        <div className="space-y-8">
                            {/* Product Identity */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-4 bg-surface-container-low px-2 text-[10px] font-label uppercase tracking-widest text-primary">Product Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-colors py-4 px-4 text-on-surface"
                                    placeholder="e.g. Wagyu Beef Tartare"
                                />
                                {errors.name && <p className="text-error text-[10px] mt-2 font-bold uppercase tracking-widest">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="relative">
                                    <label className="absolute -top-3 left-4 bg-surface-container-low px-2 text-[10px] font-label uppercase tracking-widest text-outline">Category</label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-colors py-4 px-4 text-on-surface appearance-none"
                                    >
                                        <option value="" className="bg-surface-container-high text-on-surface">Select Category</option>
                                        {categories.map(cat => (
                                            <option className="bg-surface-container-high text-on-surface" key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="absolute -top-3 left-4 bg-surface-container-low px-2 text-[10px] font-label uppercase tracking-widest text-outline">Base Price</label>
                                    <div className="flex items-center border-b-2 border-outline-variant/30 focus-within:border-primary transition-colors">
                                        <span className="pl-4 text-outline font-body">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 py-4 px-2 text-on-surface"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="absolute -top-3 left-4 bg-surface-container-low px-2 text-[10px] font-label uppercase tracking-widest text-outline">Culinary Description</label>
                                <textarea
                                    rows="3"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-colors py-4 px-4 text-on-surface resize-none"
                                    placeholder="Describe the flavor profile..."
                                />
                            </div>

                            {/* Image Upload Area [cite: 25, 43] */}
                            <div className="relative">
                                <label className="block text-[10px] font-label uppercase tracking-widest text-outline mb-4">Visual Representation</label>
                                <div className="flex items-center gap-6">
                                    {isEditing && !data.image && product.image && (
                                        <img src={product.image} className="w-24 h-24 rounded-lg object-cover border border-outline-variant/20" alt={product.name}/>
                                    )}
                                    <input
                                        type="file"
                                        onChange={e => setData('image', e.target.files[0])}
                                        className="text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-label file:uppercase file:bg-primary file:text-black file:font-bold hover:file:scale-105 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Variants & Toggles */}
                <div className="col-span-12 lg:col-span-5 space-y-8">
                    <div className="glass-panel p-8 rounded-xl border border-outline-variant/10 bg-surface-container-low sticky top-28">

                        {/* Variants Logic [cite: 11, 30] */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[10px] font-label uppercase tracking-widest text-primary font-bold">Product Variants</h4>
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="text-[10px] font-label uppercase tracking-widest text-outline hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span> Add Variant
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.variants.map((variant, index) => (
                                    <div key={index} className="flex gap-4 items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                                        <input
                                            className="bg-transparent border-none focus:ring-0 text-sm flex-1 p-0"
                                            placeholder="Variant Name e.g. Large)"
                                            value={variant.name}
                                            onChange={e => {
                                                const v = [...data.variants];
                                                v[index].name = e.target.value;
                                                setData('variants', v);
                                            }}
                                        />
                                        <div className="flex items-center text-xs text-outline bg-surface-container-high px-3 py-1 rounded-md">
                                            $ <input
                                            type="number"
                                            className="bg-transparent border-none focus:ring-0 text-xs w-16 p-0 ml-1"
                                            value={variant.price}
                                            onChange={e => {
                                                const v = [...data.variants];
                                                v[index].price = e.target.value;
                                                setData('variants', v);
                                            }}
                                        />
                                        </div>
                                        <button type="button" onClick={() => handleRemoveVariant(index)} className="text-error/60 hover:text-error transition-colors">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Toggles [cite: 7] */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between p-4 bg-surface-container-high/50 rounded-lg">
                                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface">Live Availability</span>
                                <input
                                    type="checkbox"
                                    checked={data.is_available}
                                    onChange={e => setData('is_available', e.target.checked)}
                                    className="w-10 h-5 bg-outline-variant/30 rounded-full appearance-none checked:bg-primary transition-all relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 checked:after:translate-x-5 after:transition-all"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-surface-container-high/50 rounded-lg">
                                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface">Featured Item</span>
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={e => setData('is_featured', e.target.checked)}
                                    className="w-10 h-5 bg-outline-variant/30 rounded-full appearance-none checked:bg-primary transition-all relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 checked:after:translate-x-5 after:transition-all"
                                />
                            </div>
                        </div>

                        <button
                            disabled={processing}
                            type="submit"
                            className="w-full bg-primary text-black font-label uppercase tracking-[0.2em] py-5 rounded-full font-extrabold shadow-2xl hover:scale-[1.02] transition-transform disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : isEditing ? 'Update Masterpiece' : 'Commit to Inventory'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
