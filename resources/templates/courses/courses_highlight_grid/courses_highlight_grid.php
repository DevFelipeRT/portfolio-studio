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
    'label_key' => 'label',
    'description' => 'Displays academic degree and technical courses in a highlightable grid using capabilities data.',
    'description_key' => 'description',
    'allowed_slots' => ['main'],

    'fields' => [
        [
            'name' => 'eyebrow',
            'label' => 'Section eyebrow',
            'label_key' => 'fields.eyebrow.label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'label_key' => 'fields.title.label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:120'],
        ],
        [
            'name' => 'subtitle',
            'label' => 'Section subtitle',
            'label_key' => 'fields.subtitle.label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:220'],
        ],
        [
            'name' => 'empty_message',
            'label' => 'Empty state message',
            'label_key' => 'fields.empty_message.label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:220'],
        ],
        [
            'name' => 'present_label',
            'label' => 'Present label',
            'label_key' => 'fields.present_label.label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:60'],
        ],
        [
            'name' => 'not_highlighted_label',
            'label' => 'Not highlighted badge label',
            'label_key' => 'fields.not_highlighted_label.label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:120'],
        ],
        [
            'name' => 'max_items',
            'label' => 'Maximum courses to display',
            'label_key' => 'fields.max_items.label',
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
