<?php

declare(strict_types=1);

return [
    'label' => 'Hero principal',
    'description' => 'Secao hero com destaque, texto de apoio e acao principal.',
    'fields' => [
        'eyebrow' => [
            'label' => 'Texto de apoio (kicker)',
            'default' => 'Bem-vindo',
        ],
        'title' => [
            'label' => 'Titulo da secao',
            'default' => 'Design, build e entrega',
        ],
        'description' => [
            'label' => 'Descricao da secao',
            'default' => 'Ajudo times a transformar ideias em experiencias web refinadas.',
        ],
        'headline' => [
            'label' => 'Headline do hero',
            'default' => 'Oi, eu sou Felipe.',
        ],
        'subheadline' => [
            'label' => 'Subheadline do hero',
            'default' => 'Engenheiro de produto focado em sistemas limpos e UI cuidadosa.',
        ],
        'primary_cta_label' => [
            'label' => 'Texto do CTA principal',
            'default' => 'Ver projetos',
        ],
        'primary_cta_url' => [
            'label' => 'URL do CTA principal',
            'default' => 'https://example.com',
        ],
        'highlight_badge' => [
            'label' => 'Texto do badge',
            'default' => 'Disponivel para novos trabalhos',
        ],
        'hero_image' => [
            'label' => 'Imagem do hero',
        ],
    ],
];
