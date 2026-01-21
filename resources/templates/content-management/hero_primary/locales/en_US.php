<?php

declare(strict_types=1);

return [
    'label' => 'Primary hero',
    'description' => 'Hero section with headline, supporting copy, and a primary action.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Eyebrow (short kicker)',
            'default' => 'Welcome',
        ],
        'title' => [
            'label' => 'Section title',
            'default' => 'Design, build, and ship',
        ],
        'description' => [
            'label' => 'Section description',
            'default' => 'I help teams turn ideas into polished web experiences.',
        ],
        'headline' => [
            'label' => 'Hero headline',
            'default' => 'Hi, I am Felipe.',
        ],
        'subheadline' => [
            'label' => 'Hero subheadline',
            'default' => 'Product engineer focused on clean systems and thoughtful UI.',
        ],
        'primary_cta_label' => [
            'label' => 'Primary CTA label',
            'default' => 'View projects',
        ],
        'primary_cta_url' => [
            'label' => 'Primary CTA URL',
            'default' => 'https://example.com',
        ],
        'highlight_badge' => [
            'label' => 'Highlight badge text',
            'default' => 'Available for new work',
        ],
        'hero_image' => [
            'label' => 'Hero image',
        ],
    ],
];
