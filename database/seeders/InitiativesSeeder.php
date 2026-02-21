<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Images\Domain\Models\Image;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Models\InitiativeTranslation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class InitiativesSeeder extends Seeder
{
    private const IMAGE_MANIFEST_PATH = 'database/seeders/assets/images/manifest.json';

    /**
     * Seed initiatives module base data and translations.
     */
    public function run(): void
    {
        // Keep this seeder deterministic: remove previous initiatives data first.
        if (Schema::hasTable('image_attachments')) {
            DB::table('image_attachments')
                // Owner type may be stored as morph alias or FQCN depending on context/history.
                ->whereIn('owner_type', ['initiative', Initiative::class])
                ->delete();
        }

        Initiative::query()->delete();

        $imageFilenameByItem = $this->loadSeedImageFilenameMap('initiatives');

        $initiatives = [
            [
                'locale' => 'en',
                'name' => 'Open Source Contributions Sprint',
                'summary' => 'Quarterly effort to contribute fixes and docs to open source projects.',
                'description' => $this->richTextDocument('Coordinated contributions to open source repositories with a focus on bug fixes, documentation, and onboarding improvements.'),
                'display' => true,
                'start_date' => '2024-01-15',
                'end_date' => '2024-03-30',
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Sprint de Contribuicoes Open Source',
                        'summary' => 'Esforco trimestral para contribuir com correcoes e documentacao.',
                        'description' => $this->richTextDocument('Coordenacao de contribuicoes em repositorios open source com foco em correcoes, documentacao e melhorias de onboarding.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Engineering Knowledge Base',
                'summary' => 'Internal initiative to centralize engineering guidelines and playbooks.',
                'description' => $this->richTextDocument('Built a living knowledge base for architecture standards, incident response guides, and delivery checklists.'),
                'display' => true,
                'start_date' => '2023-09-01',
                'end_date' => null,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Base de Conhecimento de Engenharia',
                        'summary' => 'Iniciativa interna para centralizar guias e playbooks de engenharia.',
                        'description' => $this->richTextDocument('Construcao de uma base viva para padroes de arquitetura, guias de incidentes e checklists de entrega.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Accessibility Improvement Program',
                'summary' => 'Cross-team effort to improve accessibility in frontend products.',
                'description' => $this->richTextDocument('Program aimed at improving semantic HTML usage, keyboard navigation, and contrast compliance across product interfaces.'),
                'display' => true,
                'start_date' => '2024-05-01',
                'end_date' => '2024-10-10',
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Programa de Melhoria de Acessibilidade',
                        'summary' => 'Esforco entre times para evoluir acessibilidade em produtos frontend.',
                        'description' => $this->richTextDocument('Programa para melhorar uso semantico de HTML, navegacao por teclado e conformidade de contraste nas interfaces.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Performance Budget Initiative',
                'summary' => 'Definition and enforcement of performance budgets for key pages.',
                'description' => $this->richTextDocument('Created measurable performance budgets and CI checks to keep page load and interaction metrics within targets.'),
                'display' => true,
                'start_date' => '2025-02-10',
                'end_date' => null,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Iniciativa de Orcamento de Performance',
                        'summary' => 'Definicao e monitoramento de orcamentos de performance em paginas criticas.',
                        'description' => $this->richTextDocument('Criacao de orcamentos mensuraveis de performance e checks em CI para manter metricas dentro das metas.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Developer Mentoring Circle',
                'summary' => 'Mentoring cycle for junior and mid-level engineers.',
                'description' => $this->richTextDocument('Structured mentoring with technical coaching, pair programming sessions, and growth plans for engineers.'),
                'display' => false,
                'start_date' => '2022-03-01',
                'end_date' => '2022-12-20',
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Ciclo de Mentoria para Desenvolvedores',
                        'summary' => 'Ciclo de mentoria para engenheiros juniores e plenos.',
                        'description' => $this->richTextDocument('Mentoria estruturada com coaching tecnico, pair programming e planos de evolucao para engenheiros.'),
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Sustainable Hosting Transition',
                'summary' => 'Migration initiative to optimize infrastructure footprint and cost.',
                'description' => $this->richTextDocument('Migration and optimization effort focused on greener hosting options, right-sizing workloads, and reducing waste.'),
                'display' => true,
                'start_date' => '2026-01-08',
                'end_date' => null,
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Transicao para Hospedagem Sustentavel',
                        'summary' => 'Iniciativa de migracao para otimizar pegada e custo de infraestrutura.',
                        'description' => $this->richTextDocument('Esforco de migracao e otimizacao com foco em hospedagem mais sustentavel, right-sizing e reducao de desperdicio.'),
                    ],
                ],
            ],
        ];

        foreach ($initiatives as $initiativeData) {
            $initiative = Initiative::query()->create([
                'locale' => $initiativeData['locale'],
                'name' => $initiativeData['name'],
                'summary' => $initiativeData['summary'],
                'description' => $initiativeData['description'],
                'display' => $initiativeData['display'],
                'start_date' => $initiativeData['start_date'],
                'end_date' => $initiativeData['end_date'],
            ]);

            $this->seedInitiativeTranslations($initiative, $initiativeData['translations'] ?? []);
            $this->attachSeedImage($initiative, $imageFilenameByItem[$initiative->name] ?? null);
        }
    }

    /**
     * @param array<string,array<string,string>> $translations
     */
    private function seedInitiativeTranslations(Initiative $initiative, array $translations): void
    {
        foreach ($translations as $locale => $data) {
            if ($locale === $initiative->locale) {
                continue;
            }

            InitiativeTranslation::query()->create([
                'initiative_id' => $initiative->id,
                'locale' => $locale,
                'name' => $data['name'] ?? null,
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

    /**
     * @return array<string,string> Map: seeder_item -> original filename
     */
    private function loadSeedImageFilenameMap(string $module): array
    {
        $path = base_path(self::IMAGE_MANIFEST_PATH);
        if (!is_file($path)) {
            return [];
        }

        $raw = file_get_contents($path);
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return [];
        }

        $map = [];

        foreach ($decoded as $entry) {
            if (!is_array($entry)) {
                continue;
            }

            if (($entry['module'] ?? null) !== $module) {
                continue;
            }

            $item = $entry['seeder_item'] ?? null;
            $localPath = $entry['local_path'] ?? null;

            if (!is_string($item) || trim($item) === '') {
                continue;
            }

            if (!is_string($localPath) || trim($localPath) === '') {
                continue;
            }

            $map[trim($item)] = basename($localPath);
        }

        return $map;
    }

    private function attachSeedImage(Initiative $initiative, ?string $originalFilename): void
    {
        if (!is_string($originalFilename) || trim($originalFilename) === '') {
            return;
        }

        $image = Image::query()
            ->where('original_filename', trim($originalFilename))
            ->first();

        if (!$image) {
            return;
        }

        $initiative->images()->syncWithoutDetaching([
            $image->id => [
                'position' => 0,
                'is_cover' => true,
                'caption' => $image->caption ?? $initiative->name,
            ],
        ]);
    }
}
