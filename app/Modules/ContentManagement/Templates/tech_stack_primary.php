<?php

declare(strict_types=1);

/**
 * Technology stack primary section template definition.
 *
 * Exposes a technology stack section that renders technologies grouped
 * by category, using the Technologies module capability as data source.
 *
 * @return array<string,mixed>
 */
return [
    'key' => 'tech_stack_primary',
    'label' => 'Technology stack section',
    'description' => 'Shows portfolio technologies grouped by category using capabilities.',
    'allowed_slots' => ['main'],

    'fields' => [
        // Common section header fields
        [
            'name' => 'section_label',
            'label' => 'Section aria label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:160'],
        ],
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
            'validation' => ['max:160'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'type' => 'text',
            'required' => false,
            'default' => null,
            'validation' => ['max:500'],
        ],
    ],

    // Data source configuration for this template
    'data_source' => [
        'type' => 'capability',
        'capability_key' => 'technologies.grouped_by_category.v1',
        'parameter_mapping' => [
            // No parameters currently required by this capability
        ],
        'target_field' => 'groups',
    ],
];
