<?php

declare(strict_types=1);

return [
    'label' => 'Project highlight list',
    'description' => 'Showcases a curated or filtered list of projects.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Eyebrow text',
        ],
        'title' => [
            'label' => 'Section title',
        ],
        'description' => [
            'label' => 'Section description',
        ],
        'subtitle' => [
            'label' => 'Block subtitle',
        ],
        'max_items' => [
            'label' => 'Maximum items',
        ],
        'highlight_only' => [
            'label' => 'Only highlighted projects',
        ],
        'project_ids' => [
            'label' => 'Explicit project IDs',
        ],
    ],
];
