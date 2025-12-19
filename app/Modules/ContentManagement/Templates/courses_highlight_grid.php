<?php

declare(strict_types=1);

/**
 * Courses highlight grid template definition.
 *
 * @return array<string, mixed>
 */
return [
    'key' => 'courses_highlight_grid',
    'label' => 'Courses highlight grid',
    'description' => 'Displays academic degree and technical courses in a highlightable grid using capabilities data.',
    'allowed_slots' => ['main'],

    'fields' => [
        [
            'name' => 'eyebrow',
            'label' => 'Section eyebrow',
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
            'validation' => ['max:120'],
        ],
        [
            'name' => 'subtitle',
            'label' => 'Section subtitle',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:220'],
        ],
        [
            'name' => 'empty_message',
            'label' => 'Empty state message',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:220'],
        ],
        [
            'name' => 'present_label',
            'label' => 'Present label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:60'],
        ],
        [
            'name' => 'not_highlighted_label',
            'label' => 'Not highlighted badge label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:120'],
        ],
        [
            'name' => 'max_items',
            'label' => 'Maximum courses to display',
            'type' => 'integer',
            'required' => false,
            'default' => 8,
            'validation' => ['integer', 'min:1', 'max:24'],
        ],
    ],

    'data_source' => [
        'type' => 'capability',
        'capability_key' => 'courses.visible.v1',
        'parameter_mapping' => [
            // section data field name => capability parameter name
            'max_items' => 'limit',
        ],
        'target_field' => 'courses',
    ],
];
