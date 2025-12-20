<?php

declare(strict_types=1);

/**
 * Cards grid template configuration for the content management module.
 *
 * Card data is modeled as a collection of items, each one describing
 * the content for a single card in the grid.
 *
 * @return array<string,mixed>
 */
return [
    'key' => 'cards_grid_primary',
    'label' => 'Cards grid',
    'description' => 'Grid of cards with configurable header, layout and text content.',
    'allowed_slots' => ['main'],
    'fields' => [
        // Section header fields
        [
            'name' => 'eyebrow',
            'label' => 'Eyebrow text',
            'type' => 'string',
            'required' => false,
            'default' => 'Highlights',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'type' => 'string',
            'required' => false,
            'default' => 'How I like to approach software projects.',
            'validation' => ['max:150'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'type' => 'text',
            'required' => false,
            'default' => 'These points summarize how I usually think about design, implementation and collaboration in real-world applications.',
            'validation' => ['max:500'],
        ],

        // Layout options
        [
            'name' => 'columns',
            'label' => 'Number of columns',
            'type' => 'integer',
            'required' => false,
            'default' => 3,
            'validation' => ['in:2,3'],
        ],
        [
            'name' => 'has_border_top',
            'label' => 'Show top border',
            'type' => 'boolean',
            'required' => false,
            'default' => true,
            'validation' => [],
        ],
        [
            'name' => 'align_header',
            'label' => 'Header alignment',
            'type' => 'string',
            'required' => false,
            'default' => 'left',
            'validation' => ['in:left,center'],
        ],
        [
            'name' => 'max_items',
            'label' => 'Maximum cards',
            'type' => 'integer',
            'required' => false,
            'default' => null,
            'validation' => ['integer', 'min:1'],
        ],

        // Cards collection
        [
            'name' => 'cards',
            'label' => 'Cards',
            'type' => 'collection',
            'required' => false,
            'default' => null,
            'validation' => ['array'],
            'item_fields' => [
                [
                    'name' => 'title',
                    'label' => 'Card title',
                    'type' => 'string',
                    'required' => true,
                    'default' => null,
                    'validation' => ['max:150'],
                ],
                [
                    'name' => 'subtitle',
                    'label' => 'Card subtitle',
                    'type' => 'string',
                    'required' => false,
                    'default' => null,
                    'validation' => ['max:200'],
                ],
                [
                    'name' => 'content',
                    'label' => 'Card content',
                    'type' => 'text',
                    'required' => false,
                    'default' => null,
                    'validation' => ['max:2000'],
                ],
                [
                    'name' => 'footer',
                    'label' => 'Card footer',
                    'type' => 'string',
                    'required' => false,
                    'default' => null,
                    'validation' => ['max:200'],
                ],
            ],
        ],
    ],
];
