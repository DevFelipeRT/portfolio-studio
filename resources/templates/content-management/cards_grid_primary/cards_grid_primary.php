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
    'label_key' => 'label',
    'description' => 'Flexible grid of cards with optional header copy and layout controls.',
    'description_key' => 'description',
    'allowed_slots' => ['hero', 'main'],
    'fields' => [
        // Section header fields
        [
            'name' => 'eyebrow',
            'label' => 'Eyebrow (short kicker)',
            'label_key' => 'fields.eyebrow.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Highlights',
            'default_key' => 'fields.eyebrow.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'label_key' => 'fields.title.label',
            'type' => 'string',
            'required' => false,
            'default' => 'How I approach software projects.',
            'default_key' => 'fields.title.default',
            'validation' => ['max:150'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'label_key' => 'fields.description.label',
            'type' => 'text',
            'required' => false,
            'default' => 'A few principles that guide my work across design, delivery, and collaboration.',
            'default_key' => 'fields.description.default',
            'validation' => ['max:500'],
        ],

        // Layout options
        [
            'name' => 'columns',
            'label' => 'Columns (2 or 3)',
            'label_key' => 'fields.columns.label',
            'type' => 'integer',
            'required' => false,
            'default' => 3,
            'validation' => ['in:2,3'],
        ],
        [
            'name' => 'has_border_top',
            'label' => 'Show top divider',
            'label_key' => 'fields.has_border_top.label',
            'type' => 'boolean',
            'required' => false,
            'default' => true,
            'validation' => [],
        ],
        [
            'name' => 'align_header',
            'label' => 'Header alignment',
            'label_key' => 'fields.align_header.label',
            'type' => 'string',
            'required' => false,
            'default' => 'left',
            'validation' => ['in:left,center'],
        ],
        [
            'name' => 'max_items',
            'label' => 'Max cards to show',
            'label_key' => 'fields.max_items.label',
            'type' => 'integer',
            'required' => false,
            'default' => null,
            'validation' => ['integer', 'min:1'],
        ],

        // Cards collection
        [
            'name' => 'cards',
            'label' => 'Cards list',
            'label_key' => 'fields.cards.label',
            'type' => 'collection',
            'required' => false,
            'default' => null,
            'validation' => ['array'],
            'item_fields' => [
                [
                    'name' => 'title',
                    'label' => 'Card title',
                    'label_key' => 'fields.cards.items.title.label',
                    'type' => 'string',
                    'required' => true,
                    'default' => null,
                    'validation' => ['max:150'],
                ],
                [
                    'name' => 'subtitle',
                    'label' => 'Card subtitle',
                    'label_key' => 'fields.cards.items.subtitle.label',
                    'type' => 'string',
                    'required' => false,
                    'default' => null,
                    'validation' => ['max:200'],
                ],
                [
                    'name' => 'content',
                    'label' => 'Card body',
                    'label_key' => 'fields.cards.items.content.label',
                    'type' => 'text',
                    'required' => false,
                    'default' => null,
                    'validation' => ['max:2000'],
                ],
                [
                    'name' => 'footer',
                    'label' => 'Card footer',
                    'label_key' => 'fields.cards.items.footer.label',
                    'type' => 'string',
                    'required' => false,
                    'default' => null,
                    'validation' => ['max:200'],
                ],
            ],
        ],
    ],
];
