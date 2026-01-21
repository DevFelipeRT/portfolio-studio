<?php

declare(strict_types=1);

return [
    'label' => 'Lista de projetos em destaque',
    'description' => 'Exibe uma lista filtrada de projetos.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Texto de apoio',
        ],
        'title' => [
            'label' => 'Titulo da secao',
        ],
        'description' => [
            'label' => 'Descricao da secao',
        ],
        'subtitle' => [
            'label' => 'Subtitulo do bloco',
        ],
        'max_items' => [
            'label' => 'Maximo de itens',
        ],
        'highlight_only' => [
            'label' => 'Somente projetos em destaque',
        ],
        'project_ids' => [
            'label' => 'IDs de projetos explicitos',
        ],
    ],
];
