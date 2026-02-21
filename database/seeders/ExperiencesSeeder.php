<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Models\ExperienceTranslation;
use Database\Seeders\Concerns\PreventsProductionSeeding;
use Illuminate\Database\Seeder;

class ExperiencesSeeder extends Seeder
{
    use PreventsProductionSeeding;

    /**
     * Seed experiences module base data and translations.
     */
    public function run(): void
    {
        $this->assertNotProduction();

        // Keep this seeder deterministic: remove previous experiences data first.
        Experience::query()->delete();

        $experiences = [
            [
                'locale' => 'en',
                'position' => 'Junior Software Engineer',
                'company' => 'Nova Systems',
                'summary' => 'Worked on internal web tools and backend APIs.',
                'description' => $this->richTextDocument('Contributed to internal products, bug fixing, API integrations, and early backend architecture decisions.'),
                'start_date' => '2019-03-01',
                'end_date' => '2020-08-31',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'position' => 'Engenheiro de Software Junior',
                        'company' => 'Nova Systems',
                        'summary' => 'Atuacao em ferramentas internas web e APIs backend.',
                        'description' => $this->richTextDocument('Contribuicao em produtos internos, correcao de bugs, integracoes de API e decisoes iniciais de arquitetura backend.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'position' => 'Software Engineer',
                'company' => 'Atlas Digital',
                'summary' => 'Built modular services and modernized legacy features.',
                'description' => $this->richTextDocument('Implemented modular services, improved observability, and led incremental refactors in a legacy monolith.'),
                'start_date' => '2020-09-01',
                'end_date' => '2022-05-31',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'position' => 'Engenheiro de Software',
                        'company' => 'Atlas Digital',
                        'summary' => 'Construcao de servicos modulares e modernizacao de legados.',
                        'description' => $this->richTextDocument('Implementacao de servicos modulares, melhoria de observabilidade e lideranca de refatoracoes incrementais em monolito legado.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'position' => 'Senior Software Engineer',
                'company' => 'Vertex Labs',
                'summary' => 'Led architecture decisions for high-traffic applications.',
                'description' => $this->richTextDocument('Drove architecture and performance initiatives, mentoring engineers and improving deployment reliability.'),
                'start_date' => '2022-06-01',
                'end_date' => '2024-02-29',
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'position' => 'Engenheiro de Software Senior',
                        'company' => 'Vertex Labs',
                        'summary' => 'Lideranca de decisoes de arquitetura para aplicacoes de alto trafego.',
                        'description' => $this->richTextDocument('Conducao de iniciativas de arquitetura e performance, mentoria tecnica e evolucao da confiabilidade de deploy.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'position' => 'Tech Lead',
                'company' => 'Orion Platform',
                'summary' => 'Coordinating roadmap execution and engineering standards.',
                'description' => $this->richTextDocument('Responsible for technical direction, cross-team delivery planning, and code quality standards across services.'),
                'start_date' => '2024-03-01',
                'end_date' => null,
                'display' => true,
                'translations' => [
                    'pt_BR' => [
                        'position' => 'Tech Lead',
                        'company' => 'Orion Platform',
                        'summary' => 'Coordenacao de roadmap e padroes de engenharia.',
                        'description' => $this->richTextDocument('Responsavel por direcao tecnica, planejamento de entregas entre times e padroes de qualidade de codigo.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'position' => 'Freelance Web Developer',
                'company' => 'Independent',
                'summary' => 'Delivered websites and custom dashboards for small businesses.',
                'description' => $this->richTextDocument('Built and maintained custom web solutions, including CMS integrations and performance optimization.'),
                'start_date' => '2018-01-01',
                'end_date' => '2019-02-15',
                'display' => false,
                'translations' => [
                    'pt_BR' => [
                        'position' => 'Desenvolvedor Web Freelancer',
                        'company' => 'Independente',
                        'summary' => 'Entrega de sites e dashboards personalizados para pequenas empresas.',
                        'description' => $this->richTextDocument('Desenvolvimento e manutencao de solucoes web customizadas, com integracoes CMS e otimizacao de performance.'),
                    ],
                ],
            ],
        ];

        foreach ($experiences as $experienceData) {
            $experience = Experience::query()->create([
                'locale' => $experienceData['locale'],
                'position' => $experienceData['position'],
                'company' => $experienceData['company'],
                'summary' => $experienceData['summary'],
                'description' => $experienceData['description'],
                'start_date' => $experienceData['start_date'],
                'end_date' => $experienceData['end_date'],
                'display' => $experienceData['display'],
            ]);

            $this->seedExperienceTranslations($experience, $experienceData['translations'] ?? []);
        }
    }

    /**
     * @param array<string,array<string,string>> $translations
     */
    private function seedExperienceTranslations(Experience $experience, array $translations): void
    {
        foreach ($translations as $locale => $data) {
            if ($locale === $experience->locale) {
                continue;
            }

            ExperienceTranslation::query()->create([
                'experience_id' => $experience->id,
                'locale' => $locale,
                'position' => $data['position'] ?? null,
                'company' => $data['company'] ?? null,
                'summary' => $data['summary'] ?? null,
                'description' => $data['description'] ?? null,
            ]);
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
