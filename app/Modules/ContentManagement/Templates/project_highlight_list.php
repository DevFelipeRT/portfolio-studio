<?php

declare(strict_types=1);

/**
 * Project highlight list template definition.
 *
 * @return array<string,mixed>
 */
return [
    'key' => 'project_highlight_list',
    'label' => 'Project highlight list',
    'description' => 'Showcases a curated or filtered list of projects.',
    'allowed_slots' => ['main'],
    'fields' => [
        // Common section header fields
        [
            'name' => 'eyebrow',
            'label' => 'Eyebrow text',
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
            'validation' => ['max:255'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'type' => 'text',
            'required' => false,
            'default' => null,
            'validation' => ['max:500'],
        ],

        // Project highlight specific fields
        [
            'name' => 'subtitle',
            'label' => 'Block subtitle',
            'type' => 'text',
            'required' => false,
            'default' => null,
            'validation' => ['max:500'],
        ],
        [
            'name' => 'max_items',
            'label' => 'Maximum items',
            'type' => 'integer',
            'required' => false,
            'default' => null,
            'validation' => ['min:0', 'max:12'],
        ],
        [
            'name' => 'highlight_only',
            'label' => 'Only highlighted projects',
            'type' => 'boolean',
            'required' => false,
            'default' => true,
            'validation' => [],
        ],
        [
            'name' => 'project_ids',
            'label' => 'Explicit project IDs',
            'type' => 'array_integer',
            'required' => false,
            'default' => [],
            'validation' => [],
        ],
    ],

    // Data source configuration for this template
    'data_source' => [
        'type' => 'capability',
        'capability_key' => 'projects.visible.v1',
        'parameter_mapping' => [
            // section data field name => capability parameter name
            'max_items' => 'limit',
        ],
        'target_field' => 'projects',
    ],
];
