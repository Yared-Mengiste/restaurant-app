import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CategoryForm({ category = null }) {
    const isEditing = !!category;
    const { data, setData, post, processing, errors } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            post(route('admin.categories.update', category.id)); // Use POST with _method=PATCH handled by form data [cite: 116]
        } else {
            post(route('admin.categories.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Refine Category' : 'New Category'} />
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                <div className="glass-panel p-10 rounded-xl bg-surface-container-low shadow-2xl border border-outline-variant/10">
                    <div className="space-y-8">
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-surface-container-low px-2 text-[10px] font-label uppercase text-primary">Category Name</label>
                            <input
                                type="text" value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-4 px-4 text-on-surface focus:border-primary focus:ring-0"
                            />
                            {errors.name && <p className="text-error text-[10px] mt-2 uppercase font-bold">{errors.name}</p>}
                        </div>

                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-surface-container-low px-2 text-[10px] font-label uppercase text-outline">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-4 px-4 text-on-surface focus:border-primary focus:ring-0 resize-none"
                                rows="3"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-label uppercase text-outline">Category Image</label>
                            <input type="file" onChange={e => setData('image', e.target.files[0])} className="text-xs text-on-surface-variant file:bg-primary file:border-0 file:rounded-full file:px-4 file:py-2 file:font-bold" />
                        </div>

                        <button disabled={processing} className="w-full bg-primary text-black py-5 rounded-full font-extrabold uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                            {isEditing ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
