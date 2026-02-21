<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\ContentManagement\Domain\Models\ContentSettings;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use App\Modules\Images\Domain\Models\Image;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ContentManagementSeeder extends Seeder
{
    /**
     * Seed content pages and sections with deterministic data.
     */
    public function run(): void
    {
        $this->clearPreviousData();

        $pages = [
            [
                'slug' => 'home',
                'internal_name' => 'landing_home',
                'title' => 'Portfolio Studio',
                'meta_title' => 'Portfolio Studio | Home',
                'meta_description' => 'Portfolio Studio: projects, experiences, initiatives, and ways to get in touch.',
                'layout_key' => 'landing_full',
                'locale' => 'pt_BR',
                'is_published' => true,
                'is_indexable' => true,
                'sections' => [
                    [
                        'template_key' => 'hero_primary',
                        'slot' => 'hero',
                        'position' => 1,
                        'anchor' => 'inicio',
                        'navigation_label' => 'Inicio',
                        'locale' => 'pt_BR',
                        'data' => [
                            'eyebrow' => 'Portfolio Studio',
                            'title' => 'Engenharia de software com foco em produto e entrega.',
                            'description' => 'Projetos reais, arquitetura modular e melhoria contínua de experiência e performance.',
                            'headline' => 'Construindo produtos confiáveis e escaláveis.',
                            'subheadline' => 'Do planejamento técnico à entrega contínua, com qualidade e clareza.',
                            'primary_cta_label' => 'Ver projetos',
                            'primary_cta_url' => 'https://portfolio.studio/content/home#projetos',
                            'highlight_badge' => 'Disponível para novos desafios',
                        ],
                    ],
                    [
                        'template_key' => 'project_highlight_list',
                        'slot' => 'main',
                        'position' => 2,
                        'anchor' => 'projetos',
                        'navigation_label' => 'Projetos',
                        'locale' => 'pt_BR',
                        'data' => [
                            'eyebrow' => 'Projetos',
                            'title' => 'Projetos em destaque',
                            'description' => 'Seleção de produtos e plataformas com foco em engenharia, UX e resultado.',
                            'subtitle' => 'Produtos web, APIs e soluções full stack.',
                            'max_items' => 6,
                            'highlight_only' => true,
                            'project_ids' => [],
                        ],
                    ],
                    [
                        'template_key' => 'skills_primary',
                        'slot' => 'main',
                        'position' => 3,
                        'anchor' => 'habilidades',
                        'navigation_label' => 'Habilidades',
                        'locale' => 'pt_BR',
                        'data' => [
                            'section_label' => 'Habilidades',
                            'eyebrow' => 'Stack',
                            'title' => 'Tecnologias e ferramentas',
                            'description' => 'Conjunto de tecnologias aplicadas no dia a dia para construir e evoluir produtos.',
                        ],
                    ],
                    [
                        'template_key' => 'experience_timeline',
                        'slot' => 'main',
                        'position' => 4,
                        'anchor' => 'experiencia',
                        'navigation_label' => 'Experiência',
                        'locale' => 'pt_BR',
                        'data' => [
                            'eyebrow' => 'Carreira',
                            'title' => 'Experiência profissional',
                            'subtitle' => 'Trajetória em engenharia de software e liderança técnica.',
                            'empty_message' => 'Nenhuma experiência disponível no momento.',
                            'present_label' => 'Atualmente',
                            'max_items' => 6,
                        ],
                    ],
                    [
                        'template_key' => 'courses_highlight_grid',
                        'slot' => 'main',
                        'position' => 5,
                        'anchor' => 'formacao',
                        'navigation_label' => 'Formação',
                        'locale' => 'pt_BR',
                        'data' => [
                            'eyebrow' => 'Aprendizado',
                            'title' => 'Cursos e certificações',
                            'subtitle' => 'Formação contínua em arquitetura, cloud e desenvolvimento de produto.',
                            'empty_message' => 'Nenhum curso destacado no momento.',
                            'present_label' => 'Em andamento',
                            'not_highlighted_label' => 'Não destacado',
                            'max_items' => 8,
                        ],
                    ],
                    [
                        'template_key' => 'initiative_highlight_list',
                        'slot' => 'main',
                        'position' => 6,
                        'anchor' => 'iniciativas',
                        'navigation_label' => 'Iniciativas',
                        'locale' => 'pt_BR',
                        'data' => [
                            'eyebrow' => 'Iniciativas',
                            'title' => 'Projetos paralelos e programas',
                            'subtitle' => 'Ações estratégicas em acessibilidade, performance e colaboração técnica.',
                            'max_items' => 6,
                        ],
                    ],
                    [
                        'template_key' => 'contact_primary',
                        'slot' => 'main',
                        'position' => 7,
                        'anchor' => 'contato',
                        'navigation_label' => 'Contato',
                        'locale' => 'pt_BR',
                        'data' => [
                            'section_label' => 'Contato',
                            'eyebrow' => 'Contato',
                            'title' => 'Vamos conversar sobre projeto, produto ou oportunidade.',
                            'description' => 'Use o formulário ou os canais abaixo para iniciar uma conversa.',
                            'form_title' => 'Enviar mensagem',
                            'form_description' => 'Compartilhe contexto e objetivo. Retorno o quanto antes.',
                            'name_label' => 'Nome',
                            'name_placeholder' => 'Seu nome completo',
                            'email_label' => 'E-mail',
                            'email_placeholder' => 'voce@empresa.com',
                            'message_label' => 'Mensagem',
                            'message_placeholder' => 'Como posso ajudar?',
                            'submit_label' => 'Enviar mensagem',
                            'submit_processing_label' => 'Enviando...',
                            'sidebar_heading' => 'Outros canais',
                            'sidebar_description' => 'Você também pode falar comigo pelos canais abaixo.',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'home',
                'internal_name' => 'landing_home',
                'title' => 'Portfolio Studio',
                'meta_title' => 'Portfolio Studio | Home',
                'meta_description' => 'Portfolio Studio: projects, experiences, initiatives, and contact channels.',
                'layout_key' => 'landing_full',
                'locale' => 'en',
                'is_published' => true,
                'is_indexable' => true,
                'sections' => [
                    [
                        'template_key' => 'hero_primary',
                        'slot' => 'hero',
                        'position' => 1,
                        'anchor' => 'home',
                        'navigation_label' => 'Home',
                        'locale' => 'en',
                        'data' => [
                            'eyebrow' => 'Portfolio Studio',
                            'title' => 'Software engineering focused on product and delivery.',
                            'description' => 'Real-world projects, modular architecture, and continuous improvements in UX and performance.',
                            'headline' => 'Building reliable and scalable products.',
                            'subheadline' => 'From technical planning to continuous delivery, with quality and clarity.',
                            'primary_cta_label' => 'View projects',
                            'primary_cta_url' => 'https://portfolio.studio/content/home#projects',
                            'highlight_badge' => 'Open to new opportunities',
                        ],
                    ],
                    [
                        'template_key' => 'project_highlight_list',
                        'slot' => 'main',
                        'position' => 2,
                        'anchor' => 'projects',
                        'navigation_label' => 'Projects',
                        'locale' => 'en',
                        'data' => [
                            'eyebrow' => 'Projects',
                            'title' => 'Highlighted projects',
                            'description' => 'A curated list of products and platforms built with engineering, UX, and business outcomes in mind.',
                            'subtitle' => 'Web products, APIs, and full stack solutions.',
                            'max_items' => 6,
                            'highlight_only' => true,
                            'project_ids' => [],
                        ],
                    ],
                    [
                        'template_key' => 'skills_primary',
                        'slot' => 'main',
                        'position' => 3,
                        'anchor' => 'skills',
                        'navigation_label' => 'Skills',
                        'locale' => 'en',
                        'data' => [
                            'section_label' => 'Skills',
                            'eyebrow' => 'Stack',
                            'title' => 'Technologies and tooling',
                            'description' => 'The stack used daily to build, scale, and maintain products.',
                        ],
                    ],
                    [
                        'template_key' => 'experience_timeline',
                        'slot' => 'main',
                        'position' => 4,
                        'anchor' => 'experience',
                        'navigation_label' => 'Experience',
                        'locale' => 'en',
                        'data' => [
                            'eyebrow' => 'Career',
                            'title' => 'Professional experience',
                            'subtitle' => 'Journey across software engineering and technical leadership.',
                            'empty_message' => 'No experience entries available.',
                            'present_label' => 'Present',
                            'max_items' => 6,
                        ],
                    ],
                    [
                        'template_key' => 'courses_highlight_grid',
                        'slot' => 'main',
                        'position' => 5,
                        'anchor' => 'education',
                        'navigation_label' => 'Education',
                        'locale' => 'en',
                        'data' => [
                            'eyebrow' => 'Learning',
                            'title' => 'Courses and certifications',
                            'subtitle' => 'Continuous development in architecture, cloud, and product engineering.',
                            'empty_message' => 'No highlighted courses available.',
                            'present_label' => 'In progress',
                            'not_highlighted_label' => 'Not highlighted',
                            'max_items' => 8,
                        ],
                    ],
                    [
                        'template_key' => 'initiative_highlight_list',
                        'slot' => 'main',
                        'position' => 6,
                        'anchor' => 'initiatives',
                        'navigation_label' => 'Initiatives',
                        'locale' => 'en',
                        'data' => [
                            'eyebrow' => 'Initiatives',
                            'title' => 'Programs and side initiatives',
                            'subtitle' => 'Strategic efforts across accessibility, performance, and engineering collaboration.',
                            'max_items' => 6,
                        ],
                    ],
                    [
                        'template_key' => 'contact_primary',
                        'slot' => 'main',
                        'position' => 7,
                        'anchor' => 'contact',
                        'navigation_label' => 'Contact',
                        'locale' => 'en',
                        'data' => [
                            'section_label' => 'Contact',
                            'eyebrow' => 'Contact',
                            'title' => 'Let\'s talk about projects, product strategy, or opportunities.',
                            'description' => 'Use the form or the channels below to start a conversation.',
                            'form_title' => 'Send a message',
                            'form_description' => 'Share context and goals. I will reply as soon as possible.',
                            'name_label' => 'Name',
                            'name_placeholder' => 'Your full name',
                            'email_label' => 'Email',
                            'email_placeholder' => 'you@company.com',
                            'message_label' => 'Message',
                            'message_placeholder' => 'How can I help?',
                            'submit_label' => 'Send message',
                            'submit_processing_label' => 'Sending...',
                            'sidebar_heading' => 'Other channels',
                            'sidebar_description' => 'You can also reach me through the channels below.',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'about',
                'internal_name' => 'about_me',
                'title' => 'Sobre',
                'meta_title' => 'Portfolio Studio | Sobre',
                'meta_description' => 'Sobre o Portfolio Studio, visão de trabalho e princípios de engenharia.',
                'layout_key' => 'default',
                'locale' => 'pt_BR',
                'is_published' => true,
                'is_indexable' => true,
                'sections' => [
                    [
                        'template_key' => 'rich_text',
                        'slot' => 'main',
                        'position' => 1,
                        'anchor' => 'sobre',
                        'navigation_label' => 'Sobre',
                        'locale' => 'pt_BR',
                        'data' => [
                            'eyebrow' => 'Sobre',
                            'title' => 'Como trabalho',
                            'description' => 'Princípios de produto, arquitetura e colaboração.',
                            'body' => 'Meu foco esta em construir produtos digitais sustentaveis, com arquitetura clara e ciclo de entrega continuo.'
                                . "\n\n"
                                . 'Trabalho com visao de produto, engenharia pragmatica e atencao a experiencia de usuario.',
                        ],
                    ],
                    [
                        'template_key' => 'cards_grid_primary',
                        'slot' => 'main',
                        'position' => 2,
                        'anchor' => 'principios',
                        'navigation_label' => 'Princípios',
                        'locale' => 'pt_BR',
                        'data' => [
                            'eyebrow' => 'Princípios',
                            'title' => 'Pilares de execução',
                            'description' => 'Como decisões técnicas e de produto são tomadas no dia a dia.',
                            'columns' => 3,
                            'has_border_top' => true,
                            'align_header' => 'left',
                            'max_items' => 6,
                            'cards' => [
                                [
                                    'title' => 'Clareza arquitetural',
                                    'subtitle' => 'Design orientado a contexto',
                                    'content' => 'Modelagem de domínio, limites de módulo e contratos explícitos.',
                                    'footer' => 'Modularidade',
                                ],
                                [
                                    'title' => 'Entrega contínua',
                                    'subtitle' => 'Incrementos pequenos',
                                    'content' => 'Automação de pipeline, revisão de código e feedback rápido.',
                                    'footer' => 'Flow',
                                ],
                                [
                                    'title' => 'Experiência do usuário',
                                    'subtitle' => 'Produto com propósito',
                                    'content' => 'Prioridade para usabilidade, acessibilidade e performance percebida.',
                                    'footer' => 'UX',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'about',
                'internal_name' => 'about_me',
                'title' => 'About',
                'meta_title' => 'Portfolio Studio | About',
                'meta_description' => 'About Portfolio Studio, delivery mindset, and engineering principles.',
                'layout_key' => 'default',
                'locale' => 'en',
                'is_published' => true,
                'is_indexable' => true,
                'sections' => [
                    [
                        'template_key' => 'rich_text',
                        'slot' => 'main',
                        'position' => 1,
                        'anchor' => 'about',
                        'navigation_label' => 'About',
                        'locale' => 'en',
                        'data' => [
                            'eyebrow' => 'About',
                            'title' => 'How I work',
                            'description' => 'Product thinking, architecture, and collaboration principles.',
                            'body' => 'I focus on building sustainable digital products with clear architecture and continuous delivery practices.'
                                . "\n\n"
                                . 'The approach combines product thinking, pragmatic engineering, and attention to user experience.',
                        ],
                    ],
                    [
                        'template_key' => 'cards_grid_primary',
                        'slot' => 'main',
                        'position' => 2,
                        'anchor' => 'principles',
                        'navigation_label' => 'Principles',
                        'locale' => 'en',
                        'data' => [
                            'eyebrow' => 'Principles',
                            'title' => 'Execution pillars',
                            'description' => 'How product and technical decisions are shaped in daily work.',
                            'columns' => 3,
                            'has_border_top' => true,
                            'align_header' => 'left',
                            'max_items' => 6,
                            'cards' => [
                                [
                                    'title' => 'Architectural clarity',
                                    'subtitle' => 'Context-driven design',
                                    'content' => 'Domain modeling, module boundaries, and explicit contracts.',
                                    'footer' => 'Modularity',
                                ],
                                [
                                    'title' => 'Continuous delivery',
                                    'subtitle' => 'Small safe increments',
                                    'content' => 'Pipeline automation, code review discipline, and rapid feedback loops.',
                                    'footer' => 'Flow',
                                ],
                                [
                                    'title' => 'User experience',
                                    'subtitle' => 'Outcome-oriented product',
                                    'content' => 'Priority on usability, accessibility, and perceived performance.',
                                    'footer' => 'UX',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($pages as $pageData) {
            $sections = $pageData['sections'];
            unset($pageData['sections']);

            $page = Page::query()->create([
                ...$pageData,
                'published_at' => $pageData['is_published'] ? Carbon::now() : null,
            ]);

            $this->seedSectionsForPage($page, $sections);
        }

        ContentSettings::query()->create([
            'home_slug' => 'home',
        ]);
    }

    /**
     * @param array<int,array<string,mixed>> $sections
     */
    private function seedSectionsForPage(Page $page, array $sections): void
    {
        $heroImageId = Image::query()
            ->where('original_filename', 'hero_primary.jpg')
            ->value('id');

        foreach ($sections as $sectionData) {
            $data = $sectionData['data'];

            if (
                $sectionData['template_key'] === 'hero_primary'
                && is_int($heroImageId)
                && is_array($data)
            ) {
                $data['hero_image'] = $heroImageId;
            }

            $section = PageSection::query()->create([
                'page_id' => $page->id,
                'template_key' => $sectionData['template_key'],
                'slot' => $sectionData['slot'],
                'position' => $sectionData['position'],
                'anchor' => $sectionData['anchor'],
                'navigation_label' => $sectionData['navigation_label'],
                'data' => $data,
                'is_active' => true,
                'visible_from' => null,
                'visible_until' => null,
                'locale' => $sectionData['locale'],
            ]);

            if (
                $sectionData['template_key'] === 'hero_primary'
                && is_int($heroImageId)
            ) {
                $section->images()->syncWithoutDetaching([
                    $heroImageId => [
                        'slot' => 'hero_image',
                        'position' => 0,
                        'is_cover' => true,
                        'caption' => 'Hero image',
                    ],
                ]);
            }
        }
    }

    private function clearPreviousData(): void
    {
        if (Schema::hasTable('image_attachments')) {
            DB::table('image_attachments')
                ->whereIn('owner_type', ['page_section', PageSection::class])
                ->delete();
        }

        ContentSettings::query()->delete();
        Page::query()->delete();
    }
}
