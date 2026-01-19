<?php

declare(strict_types=1);

/**
 * Skills primary section template definition.
 *
 * Exposes a skill stack section that renders skills grouped
 * by category, using the Skills module capability as data source.
 *
 * @return array<string,mixed>
 */
return [
    'key' => 'skills_primary',
    'label' => 'Skills primary section',
    'description' => 'Shows portfolio skills grouped by category using capabilities.',
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
        'capability_key' => 'skills.grouped_by_category.v1',
        'parameter_mapping' => [
            // No parameters currently required by this capability
        ],
        'target_field' => 'groups',
    ],
];
