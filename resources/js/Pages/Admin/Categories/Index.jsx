import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    return (
        <AdminLayout>
            <Head title="Category Management" />
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="font-headline text-5xl font-light text-on-surface">
                        The <span className="text-primary italic">Collections</span>
                    </h1>
                </div>
                <Link href={route('admin.categories.create')} className="bg-primary text-black px-8 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-xl">
                    New Category
                </Link>
            </div>

            <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-surface-container-high/30">
                        <th className="px-8 py-5 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Category</th>
                        <th className="px-8 py-5 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Description</th>
                        <th className="px-8 py-5 font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-surface-container-high/20 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-highest">
                                        <img src={cat.image ? `/storage/categories/${cat.image}` : '/placeholder.webp'} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-headline text-sm text-on-surface">{cat.name}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-on-surface-variant text-xs max-w-xs truncate">
                                {cat.description}
                            </td>
                            <td className="px-8 py-5 text-right">
                                <Link href={route('admin.categories.edit', cat.id)} className="p-2 text-on-surface-variant hover:text-white">
                                    <span className="material-symbols-outlined text-lg">edit_note</span>
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
