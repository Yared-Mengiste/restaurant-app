import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function AddressMapSelector({ onAddressSelect }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [lng, setLng] = useState(38.74); // Default to Addis Ababa
    const [lat, setLat] = useState(9.03);

    useEffect(() => {
        if (map.current) return; // Initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [lng, lat],
            zoom: 12
        });

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            placeholder: 'Search for your area...'
        });

        map.current.addControl(geocoder);

        // Handle Search Result
        geocoder.on('result', (e) => {
            const [longitude, latitude] = e.result.center;
            updateLocation(longitude, latitude, e.result.place_name);
        });

        // Handle Map Click
        map.current.on('click', async (e) => {
            const { lng, lat } = e.lngLat;
            // Optional: Reverse Geocode here to get the address string from coordinates
            updateLocation(lng, lat, "Selected Location");
        });
    }, []);

    const updateLocation = (longitude, latitude, addressLine) => {
        if (marker.current) marker.current.remove();

        marker.current = new mapboxgl.Marker({ color: '#F8C927' })
            .setLngLat([longitude, latitude])
            .addTo(map.current);

        map.current.flyTo({ center: [longitude, latitude], zoom: 15 });

        // Pass data up to parent/form
        onAddressSelect({
            address_line: addressLine,
            latitude: latitude,
            longitude: longitude
        });
    };

    return (
        <div className="space-y-4">
            <div ref={mapContainer} className="h-[400px] rounded-xl overflow-hidden border border-outline-variant/30" />
            <p className="text-xs text-on-surface-variant italic">
                * Tip: You can click directly on the map to fine-tune your location.
            </p>
        </div>
    );
}
