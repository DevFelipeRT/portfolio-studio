<?php

declare(strict_types=1);

/**
 * Primary hero template definition.
 *
 * @return array<string,mixed>
 */
return [
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
        [
            'name' => 'hero_image',
            'label' => 'Hero image',
            'type' => 'image',
            'required' => false,
            'default' => null,
            'validation' => [],
        ],
    ],
];
