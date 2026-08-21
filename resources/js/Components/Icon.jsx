import {
    Activity, ArrowLeft, Award, BarChart3, CheckCircle, ChevronDown, ChevronLeft,
    ChevronRight, CircleAlert, Eye, Heart, LayoutDashboard, MapPin, Minus, Package,
    Pencil, Plus, RefreshCw, Search, Settings, ShoppingCart, Sparkles, Trash2, X,
} from 'lucide-react';

const icons = {
    add: Plus, add_location: MapPin, arrow_back: ArrowLeft, auto_awesome: Sparkles,
    category: Package, check_circle: CheckCircle, chevron_down: ChevronDown,
    chevron_left: ChevronLeft, chevron_right: ChevronRight, delete: Trash2,
    dashboard: LayoutDashboard, edit_note: Pencil, error: CircleAlert, expand_less: ChevronDown,
    expand_more: ChevronDown, favorite: Heart, inventory_2: Package, lock_reset: RefreshCw,
    light_mode: Activity, dark_mode: Activity, restaurant_menu: Award, heart_broken: Heart,
    minus: Minus, payments: Activity, progress_activity: RefreshCw, remove: Minus,
    search: Search, settings: Settings, shopping_cart: ShoppingCart, visibility: Eye,
    star: Award, close: X, bar_chart: BarChart3,
};

export default function Icon({ name, size, className, ...props }) {
    const Component = icons[name] || Activity;
    return <Component size={size || undefined} className={className} aria-hidden="true" {...props} />;
}
