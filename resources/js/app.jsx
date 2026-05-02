import '../css/app.css';
import './bootstrap';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import {MessageProvider} from "@/Contexts/MessageContext.jsx";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
};

createInertiaApp({
    title: (title) => `${title} ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        let page = pages[`./Pages/${name}.jsx`].default;

        // 80/20 FIX: Wrap the page in the Provider here
        // This ensures the Provider is a child of the Inertia App
        page.layout = page.layout || ((page) => <MessageProvider>{page}</MessageProvider>);

        return page;
    },
    setup({ el, App, props }) {
        // Remove the MessageProvider from here
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
