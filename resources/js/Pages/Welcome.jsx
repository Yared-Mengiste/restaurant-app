import AppLayout from '@/Layouts/AppLayout';
import RestaurantHero from '@/Components/RestaurantHero';
import CategoryList from '@/Components/CategoryList';
import FeaturedProducts from '@/Components/FeaturedProducts';
import ProductGrid from '@/Components/ProductGrid';

// Fix: Add default empty object for filters to prevent "undefined" errors
export default function Welcome({
                                    auth,
                                    categories = [],
                                    featured = [],
                                    products = [],
                                    filters = { search: null, category_id: null }
                                }) {
    // Now this check will never fail because filters is at least an empty object
    const isSearching = !!(filters?.search || filters?.category_id);
    return (
        <AppLayout auth={auth} filters={filters}>
            {/* 1. Only show Hero if on the base Home page */}
            {!isSearching && <RestaurantHero />}

            {!isSearching && <div className="mx-6 md:mx-12 -mt-2 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4 text-center text-xs text-on-surface-variant"><span className="font-bold text-tertiary">Open now · 11:00–22:00</span><span>Pickup · 25–35 min</span><span>Delivery · within 10 km</span></div>}

            {/* 2. Category List stays visible for easy navigation */}
            <CategoryList
                categories={categories}
                selected={filters.category_id}
            />

            {/* 3. Featured Section (Hidden during search to reduce clutter) */}
            {!isSearching && featured.length > 0 && (
                <FeaturedProducts products={featured} auth={auth} />
            )}

            {/* 4. The Main Menu / Search Results */}
            <ProductGrid
                products={products}
                auth={auth}
                title={isSearching ? "Search Results" : "Our Menu"}
            />
        </AppLayout>
    );
}
