import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
    ],

    theme: {
        extend: {

            // ✅ MERGED COLORS
            colors: {
                primary: "#f8c927",
                secondary: "#c8c6c5",
                tertiary: "#bfcdff",
                background: "#111316",
                surface: "#111316",

                "surface-container": "#1e2023",
                "surface-container-low": "#1a1c1f",
                "surface-container-high": "#282a2d",
                "surface-container-highest": "#333538",

                "on-surface": "#e2e2e6",
                "on-background": "#e2e2e6",
                "on-primary": "#3d2f00",

                "primary-container": "#d9ae00",
                "secondary-container": "#474747",
                "tertiary-container": "#97b0ff",

                "error": "#ffb4ab",
                "error-container": "#93000a",

                "outline": "#99907c",
                "outline-variant": "#4d4635",
            },

            // ✅ MERGED FONTS
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                headline: ['Noto Serif'],
                body: ['Manrope'],
                label: ['Manrope'],
            },

            // ✅ BORDER RADIUS
            borderRadius: {
                DEFAULT: '1rem',
                lg: '2rem',
                xl: '3rem',
                full: '9999px',
            },
        },
    },

    plugins: [forms],
};
