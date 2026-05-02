<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_CALLBACK_REDIRECTS'),
    ],
    'chapa' => [
        'secret' => env('CHAPA_SECRET_KEY'),
    ],
    'mapbox' => [
        'secret_token' => env('MAPBOX_SECRET_TOKEN'),
        'public_token' => env('VITE_MAPBOX_TOKEN'),
        'restaurant_lat' => (float) env('RESTAURANT_LAT', 9.03),
        'restaurant_lng' => (float) env('RESTAURANT_LNG', 38.74),
    ],

    'delivery' => [
        'max_km' => (float) env('MAX_DELIVERY_DISTANCE_KM', 10),
        // These can also be pulled from your 'Settings' table as fallback
    ],

];
