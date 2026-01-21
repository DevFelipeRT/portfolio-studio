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
    'label_key' => 'label',
    'description' => 'Showcases a curated or filtered list of projects.',
    'description_key' => 'description',
    'allowed_slots' => ['main'],
    'fields' => [
        // Common section header fields
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
            'validation' => ['max:255'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'label_key' => 'fields.description.label',
            'type' => 'text',
            'required' => false,
            'default' => null,
            'validation' => ['max:500'],
        ],

        // Project highlight specific fields
        [
            'name' => 'subtitle',
            'label' => 'Block subtitle',
            'label_key' => 'fields.subtitle.label',
            'type' => 'text',
            'required' => false,
            'default' => null,
            'validation' => ['max:500'],
        ],
        [
            'name' => 'max_items',
            'label' => 'Maximum items',
            'label_key' => 'fields.max_items.label',
            'type' => 'integer',
            'required' => false,
            'default' => null,
            'validation' => ['min:0', 'max:12'],
        ],
        [
            'name' => 'highlight_only',
            'label' => 'Only highlighted projects',
            'label_key' => 'fields.highlight_only.label',
            'type' => 'boolean',
            'required' => false,
            'default' => true,
            'validation' => [],
        ],
        [
            'name' => 'project_ids',
            'label' => 'Explicit project IDs',
            'label_key' => 'fields.project_ids.label',
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
