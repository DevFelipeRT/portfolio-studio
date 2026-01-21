<?php

declare(strict_types=1);

return [
    'label' => 'Cards grid',
    'description' => 'Flexible grid of cards with optional header copy and layout controls.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Eyebrow (short kicker)',
            'default' => 'Highlights',
        ],
        'title' => [
            'label' => 'Section title',
            'default' => 'How I approach software projects.',
        ],
        'description' => [
            'label' => 'Section description',
            'default' => 'A few principles that guide my work across design, delivery, and collaboration.',
        ],
        'columns' => [
            'label' => 'Columns (2 or 3)',
        ],
        'has_border_top' => [
            'label' => 'Show top divider',
        ],
        'align_header' => [
            'label' => 'Header alignment',
        ],
        'max_items' => [
            'label' => 'Max cards to show',
        ],
        'cards' => [
            'label' => 'Cards list',
            'items' => [
                'title' => [
                    'label' => 'Card title',
                ],
                'subtitle' => [
                    'label' => 'Card subtitle',
                ],
                'content' => [
                    'label' => 'Card body',
                ],
                'footer' => [
                    'label' => 'Card footer',
                ],
            ],
        ],
    ],
];
