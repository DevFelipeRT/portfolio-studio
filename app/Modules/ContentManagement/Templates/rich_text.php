<?php

declare(strict_types=1);

/**
 * Rich text content template definition.
 *
 * @return array<string,mixed>
 */
return [
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
];
