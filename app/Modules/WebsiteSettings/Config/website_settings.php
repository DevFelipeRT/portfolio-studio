<?php

return [
    'defaults' => [
        'site_name' => [],
        'site_description' => [],
        'owner_name' => null,
        'default_locale' => null,
        'fallback_locale' => null,
        'meta_title_template' => '{page_title} | {owner} | {site}',
        'default_meta_title' => [],
        'default_meta_description' => [],
        'canonical_base_url' => null,
        'robots' => [
            'public' => [
                'index' => true,
                'follow' => true,
            ],
            'private' => [
                'index' => false,
                'follow' => false,
            ],
        ],
        'public_scope_enabled' => true,
        'private_scope_enabled' => true,
        'institutional_links' => [],
        'system_pages' => [],
    ],
];
