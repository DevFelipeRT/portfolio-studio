<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Supported Locales
    |--------------------------------------------------------------------------
    |
    | List of locale codes that the system (admin + internal flows) supports.
    |
    */

    'supported_locales' => [
        'pt_BR',
        'en',
    ],

    /*
    |--------------------------------------------------------------------------
    | Locale Persistence
    |--------------------------------------------------------------------------
    |
    | Configuration for how locales are persisted and read.
    |
    */

    'system_cookie_name' => env('APP_SYSTEM_LOCALE_COOKIE', 'system_locale'),

    'public_cookie_name' => env('APP_PUBLIC_LOCALE_COOKIE', 'public_locale'),

    'route_parameter' => 'locale',
];
