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
    'label_key' => 'label',
    'description' => 'Open rich-text block for editorial content, long-form notes, or narratives.',
    'description_key' => 'description',
    'allowed_slots' => ['main', 'sidebar'],
    'fields' => [
        // Common section header fields
        [
            'name' => 'eyebrow',
            'label' => 'Eyebrow (short kicker)',
            'label_key' => 'fields.eyebrow.label',
            'type' => 'string',
            'required' => false,
            'default' => 'About',
            'default_key' => 'fields.eyebrow.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'label_key' => 'fields.title.label',
            'type' => 'string',
            'required' => false,
            'default' => 'A short story',
            'default_key' => 'fields.title.default',
            'validation' => ['max:255'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'label_key' => 'fields.description.label',
            'type' => 'text',
            'required' => false,
            'default' => 'Introduce the section and set context for the reader.',
            'default_key' => 'fields.description.default',
            'validation' => ['max:500'],
        ],

        // Rich text specific fields
        [
            'name' => 'body',
            'label' => 'Body copy',
            'label_key' => 'fields.body.label',
            'type' => 'rich_text',
            'required' => true,
            'default' => 'Write the main content here.',
            'default_key' => 'fields.body.default',
            'validation' => [],
        ],
    ],
];
