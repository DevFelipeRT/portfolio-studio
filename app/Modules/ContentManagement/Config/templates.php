<?php

declare(strict_types=1);

/**
 * Declarative template catalog for the ContentManagement module.
 *
 * Each entry describes a template that can be used by PageSection entities.
 */
return [
    [
        'key' => 'hero_primary',
        'label' => 'Primary hero',
        'description' => 'Large hero section with main headline, supporting text and primary action.',
        'allowed_slots' => ['hero', 'main'],
        'fields' => [
            // Common section header fields
            [
                'name' => 'eyebrow',
                'label' => 'Eyebrow text',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:80'],
            ],
            [
                'name' => 'title',
                'label' => 'Section title',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:150'],
            ],
            [
                'name' => 'description',
                'label' => 'Section description',
                'type' => 'text',
                'required' => false,
                'default' => null,
                'validation' => ['max:500'],
            ],

            // Hero-specific fields (kept for compatibility and richer layouts)
            [
                'name' => 'headline',
                'label' => 'Headline',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:150'],
            ],
            [
                'name' => 'subheadline',
                'label' => 'Subheadline',
                'type' => 'text',
                'required' => false,
                'default' => null,
                'validation' => ['max:500'],
            ],
            [
                'name' => 'primary_cta_label',
                'label' => 'Primary CTA label',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:80'],
            ],
            [
                'name' => 'primary_cta_url',
                'label' => 'Primary CTA URL',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:255', 'url'],
            ],
            [
                'name' => 'highlight_badge',
                'label' => 'Highlight badge text',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:80'],
            ],
        ],
    ],

    [
        'key' => 'rich_text',
        'label' => 'Rich text content',
        'description' => 'Free rich-text content block, suitable for about sections or editorial content.',
        'allowed_slots' => ['main', 'sidebar'],
        'fields' => [
            // Common section header fields
            [
                'name' => 'eyebrow',
                'label' => 'Eyebrow text',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:80'],
            ],
            [
                'name' => 'title',
                'label' => 'Section title',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:255'],
            ],
            [
                'name' => 'description',
                'label' => 'Section description',
                'type' => 'text',
                'required' => false,
                'default' => null,
                'validation' => ['max:500'],
            ],

            // Rich text specific fields
            [
                'name' => 'body',
                'label' => 'Body',
                'type' => 'rich_text',
                'required' => true,
                'default' => null,
                'validation' => [],
            ],
        ],
    ],

    [
        'key' => 'project_highlight_list',
        'label' => 'Project highlight list',
        'description' => 'Showcases a curated or filtered list of projects.',
        'allowed_slots' => ['main'],
        'fields' => [
            // Common section header fields
            [
                'name' => 'eyebrow',
                'label' => 'Eyebrow text',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:80'],
            ],
            [
                'name' => 'title',
                'label' => 'Section title',
                'type' => 'string',
                'required' => false,
                'default' => null,
                'validation' => ['max:255'],
            ],
            [
                'name' => 'description',
                'label' => 'Section description',
                'type' => 'text',
                'required' => false,
                'default' => null,
                'validation' => ['max:500'],
            ],

            // Project highlight specific fields
            [
                'name' => 'subtitle',
                'label' => 'Block subtitle',
                'type' => 'text',
                'required' => false,
                'default' => null,
                'validation' => ['max:500'],
            ],
            [
                'name' => 'max_items',
                'label' => 'Maximum items',
                'type' => 'integer',
                'required' => false,
                'default' => 3,
                'validation' => ['integer', 'min:1', 'max:12'],
            ],
            [
                'name' => 'highlight_only',
                'label' => 'Only highlighted projects',
                'type' => 'boolean',
                'required' => false,
                'default' => true,
                'validation' => ['boolean'],
            ],
            [
                'name' => 'project_ids',
                'label' => 'Explicit project IDs',
                'type' => 'array_integer',
                'required' => false,
                'default' => [],
                'validation' => ['array'],
            ],
        ],
    ],
];
