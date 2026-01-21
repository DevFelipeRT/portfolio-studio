<?php

declare(strict_types=1);

return [
    'label' => 'Grade de cards',
    'description' => 'Grade flexivel de cards com cabecalho opcional e controles de layout.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Texto de apoio (kicker)',
            'default' => 'Destaques',
        ],
        'title' => [
            'label' => 'Titulo da secao',
            'default' => 'Como abordo projetos de software.',
        ],
        'description' => [
            'label' => 'Descricao da secao',
            'default' => 'Alguns principios que guiam meu trabalho em design, entrega e colaboracao.',
        ],
        'columns' => [
            'label' => 'Colunas (2 ou 3)',
        ],
        'has_border_top' => [
            'label' => 'Exibir divisor superior',
        ],
        'align_header' => [
            'label' => 'Alinhamento do cabecalho',
        ],
        'max_items' => [
            'label' => 'Maximo de cards',
        ],
        'cards' => [
            'label' => 'Lista de cards',
            'items' => [
                'title' => [
                    'label' => 'Titulo do card',
                ],
                'subtitle' => [
                    'label' => 'Subtitulo do card',
                ],
                'content' => [
                    'label' => 'Corpo do card',
                ],
                'footer' => [
                    'label' => 'Rodape do card',
                ],
            ],
        ],
    ],
];
