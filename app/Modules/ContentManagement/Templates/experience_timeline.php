<?php

declare(strict_types=1);

/**
 * Experience timeline template definition.
 *
 * @return array<string, mixed>
 */
return [
    'key' => 'experience_timeline',
    'label' => 'Experience timeline',
    'description' => 'Displays a professional experience timeline using capabilities data.',
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
            'validation' => ['max:200'],
        ],
        [
            'name' => 'empty_message',
            'label' => 'Empty state message',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:200'],
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
            'name' => 'max_items',
            'label' => 'Maximum experiences to display',
            'type' => 'integer',
            'required' => false,
            'default' => 6,
            'validation' => ['integer', 'min:1', 'max:20'],
        ],
    ],

    'data_source' => [
        'type' => 'capability',
        'capability_key' => 'experiences.visible.v1',
        'parameter_mapping' => [
            // section data field name => capability parameter name
            'max_items' => 'limit',
        ],
        'target_field' => 'experiences',
    ],
];
