<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | SSR is explicitly disabled for this application. The client renders the
    | initial visit, and the page payload is embedded in the root view.
    |
    */
    'ssr' => [
        'enabled' => (bool) env('INERTIA_SSR_ENABLED', false),
        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
        'ensure_bundle_exists' => (bool) env('INERTIA_SSR_ENSURE_BUNDLE_EXISTS', true),
        // 'bundle' => base_path('bootstrap/ssr/ssr.mjs'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    */
    'ensure_pages_exist' => false,
    'page_paths' => [
        resource_path('js/app/pages'),
    ],
    'page_extensions' => [
        'js',
        'jsx',
        'ts',
        'tsx',
        'vue',
        'svelte',
    ],

    /*
    |--------------------------------------------------------------------------
    | Testing
    |--------------------------------------------------------------------------
    */
    'testing' => [
        'ensure_pages_exist' => true,
        'page_paths' => [
            resource_path('js/app/pages'),
        ],
        'page_extensions' => [
            'js',
            'jsx',
            'ts',
            'tsx',
            'vue',
            'svelte',
        ],
    ],

    'history' => [
        'encrypt' => (bool) env('INERTIA_ENCRYPT_HISTORY', false),
    ],
];
