import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function LiveSearchBar({ isMobile = false, onClose = () => {} }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    // 1. Debounce and Fetch Data
    useEffect(() => {
        if (query.trim().length < 1) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await axios.get(route('api.search', { q: query }));
                setResults(response.data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // 2. Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'hidden md:block'}`}>
            {/* Input Field */}
            <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (query.length >= 2) setShowDropdown(true); }}
                    placeholder="Search our menu..."
                    autoFocus={isMobile}
                    className={`bg-surface-container-highest/30 border border-outline-variant/20 rounded-full pl-10 pr-10 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all ${
                        isMobile ? 'w-full bg-background border-outline-variant/30 py-3 rounded-lg' : 'w-48 lg:w-64'
                    }`}
                />
                {/* Loading Spinner */}
                {isSearching && (
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm animate-spin">
                        progress_activity
                    </span>
                )}
            </div>

            {/* Dropdown Overlay */}
            {showDropdown && (
                <div className={`absolute mt-2 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 ${
                    isMobile ? 'w-full top-full left-0' : 'w-80 right-0'
                }`}>
                    {results.length > 0 ? (
                        <ul className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
                            {results.map(product => (
                                <li key={product.id}>
                                    <Link
                                        href={route('home', { search: product.name })}
                                        onClick={() => { setShowDropdown(false); onClose(); }}
                                        className="flex items-center gap-4 px-4 py-3 hover:bg-surface-container-highest transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-highest flex-shrink-0">
                                            <img
                                                src={product.image ? `/storage/products/${product.image}` : '/placeholder.jpg'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-sm font-bold text-on-surface truncate">{product.name}</h4>
                                            <p className="text-xs text-primary font-bold">${parseFloat(product.price).toFixed(2)}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-sm text-on-surface-variant">
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
