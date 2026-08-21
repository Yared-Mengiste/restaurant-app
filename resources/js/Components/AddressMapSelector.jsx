import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

// Map container sizing
const mapContainerStyle = {
    width: '100%',
    height: 'clamp(280px, 45vh, 400px)',
    borderRadius: '0.75rem'
};

// Center explicitly on Addis Ababa
const defaultCenter = {
    lat: 9.03,
    lng: 38.74
};

// Bounding box for Addis Ababa to bias search results
const addisBounds = {
    north: 9.10,
    south: 8.85,
    east: 38.85,
    west: 38.65,
};

export default function AddressMapSelector({ onAddressSelect }) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [markerPosition, setMarkerPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [searchValue, setSearchValue] = useState('');
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);

    // Capture map instance
    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(function callback(map) {
        mapRef.current = null;
    }, []);

    // Handles map clicks and converts coordinates to a human-readable address
    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const addressLine = results[0].formatted_address;
                setSearchValue(addressLine);
                onAddressSelect({ address_line: addressLine, latitude: lat, longitude: lng });
            } else {
                onAddressSelect({ address_line: "Selected Location", latitude: lat, longitude: lng });
            }
        });
    };

    // Handles when a user selects a place from the Autocomplete search bar
    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();

            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // CHANGE THIS LINE: Prioritize place.name over formatted_address
            const addressLine = place.name || place.formatted_address;

            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });
            setSearchValue(addressLine); // This will now show "4 Kilo"

            onAddressSelect({
                address_line: addressLine,
                latitude: lat,
                longitude: lng
            });
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div className="h-[400px] bg-surface-container-high rounded-xl animate-pulse"></div>;

    return (
        <div className="space-y-4">
            {/* Search Input Layered Above Map */}
            <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={onPlaceChanged}
                options={{
                    bounds: addisBounds,
                    strictBounds: false,
                    componentRestrictions: { country: 'et' }
                }}
            >
                <input
                    type="text"
                    placeholder="Search for your area (e.g., 4 Kilo, Bole)..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
            </Autocomplete>

            <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={13}
                    onClick={handleMapClick}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
            </div>

            <p className="text-xs text-on-surface-variant italic">
                * Tip: You can click directly on the map to fine-tune your location.
            </p>
        </div>
    );
}
