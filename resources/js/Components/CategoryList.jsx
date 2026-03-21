import { router } from '@inertiajs/react';
import CategoryCard from './CategoryCard';

export default function CategoryList({ categories, selected, onSelect }) {

    const handleCategoryClick = (id) => {
        // Use the passed function OR default to Inertia router logic
        if (onSelect) {
            onSelect(id);
        } else {
            router.get(
                route('home'),
                { category_id: id },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }
    };

    return (
        <section className="py-8 px-4 md:px-12 max-w-[1920px] mx-auto overflow-hidden">
            {/* SECTION HEADING: Editorial Style */}
            <h3 className="font-headline text-2xl text-white mb-8 italic">
                Our Categories
            </h3>

            {/* HORIZONTAL SCROLL CONTAINER */}
            <div className="flex items-start overflow-x-auto no-scrollbar gap-8 md:gap-12 pb-6 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">

                {/* DEFAULT "ALL" OPTION */}
                <div onClick={() => handleCategoryClick(null)}>
                    <CategoryCard
                        name="All"
                        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=200&auto=format&fit=crop"
                        active={selected === null || selected === undefined}
                    />
                </div>

                {/* DYNAMIC CATEGORIES */}
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        <CategoryCard
                            id={category.id}
                            name={category.name}
                            image={category.image}
                            active={String(selected) === String(category.id)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
