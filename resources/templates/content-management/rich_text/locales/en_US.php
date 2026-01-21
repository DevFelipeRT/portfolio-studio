<?php

declare(strict_types=1);

return [
    'label' => 'Rich text content',
    'description' => 'Open rich-text block for editorial content, long-form notes, or narratives.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Eyebrow (short kicker)',
            'default' => 'About',
        ],
        'title' => [
            'label' => 'Section title',
            'default' => 'A short story',
        ],
        'description' => [
            'label' => 'Section description',
            'default' => 'Introduce the section and set context for the reader.',
        ],
        'body' => [
            'label' => 'Body copy',
            'default' => 'Write the main content here.',
        ],
    ],
];
