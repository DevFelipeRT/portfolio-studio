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
    'label_key' => 'label',
    'description' => 'Displays a professional experience timeline using capabilities data.',
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
            'validation' => ['max:200'],
        ],
        [
            'name' => 'empty_message',
            'label' => 'Empty state message',
            'label_key' => 'fields.empty_message.label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:200'],
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
            'name' => 'max_items',
            'label' => 'Maximum experiences to display',
            'label_key' => 'fields.max_items.label',
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
