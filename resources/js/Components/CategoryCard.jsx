import { Link } from '@inertiajs/react';

export default function CategoryCard({ id, name, image, active = false }) {
    // Default fallback image for categories (e.g., a generic high-end plate)
    const defaultImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=200&auto=format&fit=crop";

    return (
        <Link
            href={route('home', { category: id })}
            preserveState
            className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group outline-none"
        >
            {/* CIRCULAR IMAGE CONTAINER */}
            <div className={`
                w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-500 p-1
                ${active
                ? 'border-primary bg-primary/10'
                : 'border-transparent group-hover:border-primary/50 group-focus:border-primary'}
            `}>
                <img
                    alt={name}
                    src={image?`storage/categories/${image}`  :defaultImage}
                    className={`
                        w-full h-full object-cover rounded-full transition-transform duration-700
                        ${active ? 'scale-110' : 'group-hover:scale-110'}
                    `}
                    onError={(e) => { e.target.src = defaultImage; }}
                />
            </div>

            {/* CATEGORY LABEL */}
            <span className={`
                font-label text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300
                ${active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}
            `}>
                {name}
            </span>

            {/* ACTIVE INDICATOR (The Garnish) */}
            {active && (
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            )}
        </Link>
    );
}
