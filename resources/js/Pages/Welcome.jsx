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
    // console.log(products)

    return (
        <AppLayout auth={auth} filters={filters}>
            {/* 1. Only show Hero if on the base Home page */}
            {!isSearching && <RestaurantHero />}

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
