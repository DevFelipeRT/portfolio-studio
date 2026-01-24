<?php

declare(strict_types=1);

/**
 * General configuration for the ContentManagement module.
 *
 * This file holds layout, locale and SEO defaults, and wires the
 * declarative template catalog.
 */
$templateOrigins = [
    resource_path('templates'),
];

return [
    /*
    |--------------------------------------------------------------------------
    | Template discovery paths
    |--------------------------------------------------------------------------
    |
    | Absolute paths that point to template roots or origin directories
    | (for example, resources/templates or resources/templates/content-management).
    | When empty, the templates loader will auto-discover origins under
    | resources/templates.
    |
    */

    'template_origins' => $templateOrigins,


    /*
    |--------------------------------------------------------------------------
    | Layout definitions
    |--------------------------------------------------------------------------
    |
    | Each layout defines a logical set of slots that PageSection instances
    | can target. Validation and UI can use this information to restrict
    | template placement when needed.
    |
    */

    'layouts' => [
        'default' => [
            'label' => 'Default layout',
            'slots' => ['hero', 'main', 'footer'],
        ],
        'landing_full' => [
            'label' => 'Landing full layout',
            'slots' => ['hero', 'main', 'secondary', 'footer'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default pages
    |--------------------------------------------------------------------------
    |
    | This section can be used by seeds or administrative UI to suggest or
    | enforce the presence of some canonical pages.
    |
    */

    'pages' => [
        'home' => [
            'slug' => 'home',
            'internal_name' => 'landing_home',
            'layout_key' => 'landing_full',
            'locale' => 'pt_BR',
        ],
        'about' => [
            'slug' => 'about',
            'internal_name' => 'about_me',
            'layout_key' => 'default',
            'locale' => 'pt_BR',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Template catalog wiring
    |--------------------------------------------------------------------------
    |
    | The templates key exposes the declarative template catalog defined in
    | templates.php so that the TemplateRegistry can consume it through
    | config('content_management.templates').
    |
    */

    'templates' => require __DIR__ . '/templates.php',
];
