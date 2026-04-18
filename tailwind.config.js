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
                primary: "rgb(var(--primary) / <alpha-value>)",
                secondary: "rgb(var(--secondary) / <alpha-value>)",
                tertiary: "rgb(var(--tertiary) / <alpha-value>)",
                background: "rgb(var(--background) / <alpha-value>)",
                surface: "rgb(var(--surface) / <alpha-value>)",

                "surface-container": "rgb(var(--surface-container) / <alpha-value>)",
                "surface-container-low": "rgb(var(--surface-container-low) / <alpha-value>)",
                "surface-container-high": "rgb(var(--surface-container-high) / <alpha-value>)",
                "surface-container-highest": "rgb(var(--surface-container-highest) / <alpha-value>)",

                "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
                "on-background": "rgb(var(--on-background) / <alpha-value>)",
                "on-primary": "rgb(var(--on-primary) / <alpha-value>)",

                "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
                "secondary-container": "rgb(var(--secondary-container) / <alpha-value>)",
                "tertiary-container": "rgb(var(--tertiary-container) / <alpha-value>)",

                "error": "rgb(var(--error) / <alpha-value>)",
                "error-container": "rgb(var(--error-container) / <alpha-value>)",

                "outline": "rgb(var(--outline) / <alpha-value>)",
                "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
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
