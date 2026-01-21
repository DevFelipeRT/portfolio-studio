<?php

declare(strict_types=1);

return [
    'label' => 'Conteudo em rich text',
    'description' => 'Bloco de rich text para conteudo editorial, textos longos ou narrativas.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Texto de apoio (kicker)',
            'default' => 'Sobre',
        ],
        'title' => [
            'label' => 'Titulo da secao',
            'default' => 'Uma breve historia',
        ],
        'description' => [
            'label' => 'Descricao da secao',
            'default' => 'Apresente a secao e forneca contexto para o leitor.',
        ],
        'body' => [
            'label' => 'Texto principal',
            'default' => 'Escreva o conteudo principal aqui.',
        ],
    ],
];
