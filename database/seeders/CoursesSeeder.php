<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Models\CourseTranslation;
use Illuminate\Database\Seeder;

class CoursesSeeder extends Seeder
{
    /**
     * Seed courses module base data and translations.
     */
    public function run(): void
    {
        // Keep this seeder deterministic: remove previous courses data first.
        Course::query()->delete();

        $courses = [
            [
                'locale' => 'en',
                'name' => 'Bachelor of Computer Science',
                'institution' => 'Federal University',
                'category' => 'academic_degree',
                'summary' => 'Undergraduate degree focused on software engineering and distributed systems.',
                'description' => $this->richTextDocument('Undergraduate degree focused on software engineering, algorithms, databases, and distributed systems.'),
                'started_at' => '2017-02-01',
                'completed_at' => '2021-12-15',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Bacharelado em Ciencia da Computacao',
                        'institution' => 'Universidade Federal',
                        'summary' => 'Graduacao com foco em engenharia de software e sistemas distribuidos.',
                        'description' => $this->richTextDocument('Graduacao com foco em engenharia de software, algoritmos, banco de dados e sistemas distribuidos.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Laravel Advanced Architecture',
                'institution' => 'Alura',
                'category' => 'technical_course',
                'summary' => 'Advanced Laravel patterns for modular architecture and DDD.',
                'description' => $this->richTextDocument('Advanced Laravel course covering modular architecture, dependency inversion, and domain-driven design practices.'),
                'started_at' => '2023-03-10',
                'completed_at' => '2023-05-28',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Arquitetura Avancada com Laravel',
                        'institution' => 'Alura',
                        'summary' => 'Padroes avancados de Laravel para arquitetura modular e DDD.',
                        'description' => $this->richTextDocument('Curso avancado de Laravel cobrindo arquitetura modular, inversao de dependencia e praticas de DDD.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'AWS Certified Developer Preparation',
                'institution' => 'Udemy',
                'category' => 'certification',
                'summary' => 'Preparation track for AWS developer certification topics.',
                'description' => $this->richTextDocument('Preparation program focused on IAM, Lambda, API Gateway, and deployment strategies for AWS applications.'),
                'started_at' => '2024-02-01',
                'completed_at' => '2024-04-21',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Preparacao para AWS Certified Developer',
                        'institution' => 'Udemy',
                        'summary' => 'Trilha preparatoria para topicos da certificacao de desenvolvedor AWS.',
                        'description' => $this->richTextDocument('Programa de preparacao com foco em IAM, Lambda, API Gateway e estrategias de deploy na AWS.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'React and TypeScript Workshop',
                'institution' => 'Rocketseat',
                'category' => 'workshop',
                'summary' => 'Hands-on workshop for React apps with robust TypeScript typing.',
                'description' => $this->richTextDocument('Practical workshop covering reusable components, state management, and type-safe frontend architecture.'),
                'started_at' => '2024-09-02',
                'completed_at' => '2024-09-25',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Workshop de React com TypeScript',
                        'institution' => 'Rocketseat',
                        'summary' => 'Workshop pratico para aplicacoes React com tipagem robusta em TypeScript.',
                        'description' => $this->richTextDocument('Workshop pratico cobrindo componentes reutilizaveis, gerenciamento de estado e arquitetura de frontend tipada.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'System Design Fundamentals',
                'institution' => 'Coursera',
                'category' => 'technical_course',
                'summary' => 'Foundation in scalability, availability, and architectural trade-offs.',
                'description' => $this->richTextDocument('Course focused on reliability patterns, data partitioning, caching, and communication strategies in distributed systems.'),
                'started_at' => '2025-01-10',
                'completed_at' => null,
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Fundamentos de System Design',
                        'institution' => 'Coursera',
                        'summary' => 'Base em escalabilidade, disponibilidade e trade-offs arquiteturais.',
                        'description' => $this->richTextDocument('Curso com foco em padroes de confiabilidade, particionamento de dados, cache e comunicacao em sistemas distribuidos.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'English for Tech Professionals',
                'institution' => 'Open English',
                'category' => 'other',
                'summary' => 'Communication and technical vocabulary for software teams.',
                'description' => $this->richTextDocument('Training aimed at technical writing, meetings, and presentation skills for engineering contexts.'),
                'started_at' => '2023-01-05',
                'completed_at' => '2023-11-30',
                'display' => false,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Ingles para Profissionais de Tecnologia',
                        'institution' => 'Open English',
                        'summary' => 'Comunicacao e vocabulario tecnico para equipes de software.',
                        'description' => $this->richTextDocument('Treinamento voltado para escrita tecnica, reunioes e habilidades de apresentacao em contextos de engenharia.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Kubernetes in Practice',
                'institution' => 'Linux Foundation',
                'category' => 'certification',
                'summary' => 'Operational Kubernetes knowledge for production workloads.',
                'description' => $this->richTextDocument('Course addressing container orchestration, observability basics, and deployment workflows on Kubernetes clusters.'),
                'started_at' => '2026-03-01',
                'completed_at' => null,
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Kubernetes na Pratica',
                        'institution' => 'Linux Foundation',
                        'summary' => 'Conhecimento operacional de Kubernetes para cargas de producao.',
                        'description' => $this->richTextDocument('Curso sobre orquestracao de containers, fundamentos de observabilidade e fluxos de deploy em clusters Kubernetes.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Clean Code and Refactoring',
                'institution' => 'Pluralsight',
                'category' => 'technical_course',
                'summary' => 'Code quality, maintainability, and refactoring techniques.',
                'description' => $this->richTextDocument('Program centered on naming, module boundaries, testability, and safe refactoring patterns for legacy codebases.'),
                'started_at' => '2022-06-01',
                'completed_at' => '2022-08-10',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Clean Code e Refatoracao',
                        'institution' => 'Pluralsight',
                        'summary' => 'Qualidade de codigo, manutenibilidade e tecnicas de refatoracao.',
                        'description' => $this->richTextDocument('Programa focado em nomeacao, limites de modulo, testabilidade e padroes seguros de refatoracao para legados.'),
                    ],
                ],
            ],
        ];

        foreach ($courses as $courseData) {
            $course = Course::query()->create(
                [
                    'name' => $courseData['name'],
                    'institution' => $courseData['institution'],
                    'locale' => $courseData['locale'],
                    'category' => $courseData['category'],
                    'summary' => $courseData['summary'],
                    'description' => $courseData['description'],
                    'started_at' => $courseData['started_at'],
                    'completed_at' => $courseData['completed_at'],
                    'display' => $courseData['display'],
                ],
            );

            $this->seedCourseTranslations($course, $courseData['translations'] ?? []);
        }
    }

    /**
     * @param array<string,array<string,string>> $translations
     */
    private function seedCourseTranslations(Course $course, array $translations): void
    {
        foreach ($translations as $locale => $data) {
            if ($locale === $course->locale) {
                continue;
            }

            CourseTranslation::query()->create(
                [
                    'course_id' => $course->id,
                    'locale' => $locale,
                    'name' => $data['name'] ?? null,
                    'institution' => $data['institution'] ?? null,
                    'summary' => $data['summary'] ?? null,
                    'description' => $data['description'] ?? null,
                ],
            );
        }
    }

    private function richTextDocument(string $text): string
    {
        $document = [
            'root' => [
                'children' => [
                    [
                        'children' => [
                            [
                                'detail' => 0,
                                'format' => 0,
                                'mode' => 'normal',
                                'style' => '',
                                'text' => $text,
                                'type' => 'text',
                                'version' => 1,
                            ],
                        ],
                        'direction' => null,
                        'format' => '',
                        'indent' => 0,
                        'type' => 'paragraph',
                        'version' => 1,
                        'textFormat' => 0,
                        'textStyle' => '',
                    ],
                ],
                'direction' => null,
                'format' => '',
                'indent' => 0,
                'type' => 'root',
                'version' => 1,
            ],
        ];

        return json_encode($document, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
            ?: '{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
    }
}
