<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>Bello Ristorante · Italian dining in Addis Ababa</title>
    <meta name="description" content="Order wood-fired pizzas, Italian-inspired dishes, and cocktails from Bello Ristorante in Addis Ababa.">
    <meta property="og:title" content="Bello Ristorante · Addis Ababa">
    <meta property="og:description" content="Italian-inspired dining, pickup, and delivery from Bello Ristorante.">
    <meta property="og:image" content="{{ asset('images/belloHero1.jpg') }}">
    <meta property="og:type" content="restaurant">
    <link rel="canonical" href="{{ config('app.url') }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,300;0,700;1,300&family=Manrope:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead

    @php
        $restaurantSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Restaurant',
            'name' => 'Bello Ristorante',
            'servesCuisine' => 'Italian',
            'telephone' => '+251911000000',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'Bole',
                'addressLocality' => 'Addis Ababa',
                'addressCountry' => 'ET',
            ],
            'openingHours' => 'Mo-Su 11:00-22:00',
            'priceRange' => '$$',
        ];
    @endphp
    <script type="application/ld+json">{!! json_encode($restaurantSchema, JSON_UNESCAPED_SLASHES) !!}</script>

    <script>
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    </script>
</head>
<body class="bg-background text-on-surface antialiased">
@inertia
</body>
</html>
