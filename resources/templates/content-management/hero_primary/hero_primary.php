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
    'label_key' => 'label',
    'description' => 'Hero section with headline, supporting copy, and a primary action.',
    'description_key' => 'description',
    'allowed_slots' => ['hero', 'main'],
    'fields' => [
        // Common section header fields
        [
            'name' => 'eyebrow',
            'label' => 'Eyebrow (short kicker)',
            'label_key' => 'fields.eyebrow.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Welcome',
            'default_key' => 'fields.eyebrow.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'label_key' => 'fields.title.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Design, build, and ship',
            'default_key' => 'fields.title.default',
            'validation' => ['max:150'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'label_key' => 'fields.description.label',
            'type' => 'text',
            'required' => false,
            'default' => 'I help teams turn ideas into polished web experiences.',
            'default_key' => 'fields.description.default',
            'validation' => ['max:500'],
        ],

        // Hero-specific fields (kept for compatibility and richer layouts)
        [
            'name' => 'headline',
            'label' => 'Hero headline',
            'label_key' => 'fields.headline.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Hi, I am Felipe.',
            'default_key' => 'fields.headline.default',
            'validation' => ['max:150'],
        ],
        [
            'name' => 'subheadline',
            'label' => 'Hero subheadline',
            'label_key' => 'fields.subheadline.label',
            'type' => 'text',
            'required' => false,
            'default' => 'Product engineer focused on clean systems and thoughtful UI.',
            'default_key' => 'fields.subheadline.default',
            'validation' => ['max:500'],
        ],
        [
            'name' => 'primary_cta_label',
            'label' => 'Primary CTA label',
            'label_key' => 'fields.primary_cta_label.label',
            'type' => 'string',
            'required' => false,
            'default' => 'View projects',
            'default_key' => 'fields.primary_cta_label.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'primary_cta_url',
            'label' => 'Primary CTA URL',
            'label_key' => 'fields.primary_cta_url.label',
            'type' => 'string',
            'required' => false,
            'default' => 'https://example.com',
            'default_key' => 'fields.primary_cta_url.default',
            'validation' => ['max:255', 'url'],
        ],
        [
            'name' => 'highlight_badge',
            'label' => 'Highlight badge text',
            'label_key' => 'fields.highlight_badge.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Available for new work',
            'default_key' => 'fields.highlight_badge.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'hero_image',
            'label' => 'Hero image',
            'label_key' => 'fields.hero_image.label',
            'type' => 'image',
            'required' => false,
            'default' => null,
            'validation' => [],
        ],
    ],
];
