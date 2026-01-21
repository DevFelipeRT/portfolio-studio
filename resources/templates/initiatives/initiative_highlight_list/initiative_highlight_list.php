<?php

declare(strict_types=1);

/**
 * Initiative highlight list template definition.
 *
 * @return array<string, mixed>
 */
return [
    'key' => 'initiative_highlight_list',
    'label' => 'Initiative highlight list',
    'label_key' => 'label',
    'description' => 'Showcases a curated or filtered list of initiatives.',
    'description_key' => 'description',
    'allowed_slots' => ['main'],

    'fields' => [
        [
            'name' => 'eyebrow',
            'label' => 'Eyebrow text',
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
            'validation' => ['max:160'],
        ],
        [
            'name' => 'max_items',
            'label' => 'Maximum initiatives to display',
            'label_key' => 'fields.max_items.label',
            'type' => 'integer',
            'required' => false,
            'default' => 6,
            'validation' => ['integer', 'min:1', 'max:12'],
        ],
    ],

    'data_source' => [
        'type' => 'capability',
        'capability_key' => 'initiatives.visible.v1',
        'parameter_mapping' => [
            // section data field name => capability parameter name
            'max_items' => 'limit',
        ],
        'target_field' => 'initiatives',
    ],
];
