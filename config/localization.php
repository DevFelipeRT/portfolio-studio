<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Supported Locales
    |--------------------------------------------------------------------------
    |
    | List of locale codes that the application explicitly supports.
    |
    */

    'supported_locales' => [
        'pt-BR',
        'en',
    ],

    /*
    |--------------------------------------------------------------------------
    | Locale Persistence
    |--------------------------------------------------------------------------
    |
    | Configuration for how the effective locale is persisted and read.
    |
    */

    'cookie_name' => env('APP_LOCALE_COOKIE', 'locale'),

    'route_parameter' => 'locale',
];
