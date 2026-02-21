<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Images\Domain\Models\Image;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Models\ProjectTranslation;
use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProjectsSeeder extends Seeder
{
    private const IMAGE_MANIFEST_PATH = 'database/seeders/assets/images/manifest.json';

    /**
     * Seed projects module base data and translations.
     */
    public function run(): void
    {
        // Keep this seeder deterministic: remove previous projects data first.
        if (Schema::hasTable('image_attachments')) {
            DB::table('image_attachments')
                // Owner type may be stored as morph alias or FQCN depending on context/history.
                ->whereIn('owner_type', ['project', Project::class])
                ->delete();
        }

        Project::query()->delete();

        $imageFilenameByItem = $this->loadSeedImageFilenameMap('projects');

        $projects = [
            [
                'locale' => 'en',
                'name' => 'Portfolio Platform',
                'summary' => 'Modular personal platform with CMS-driven sections.',
                'description' => $this->richTextDocument('A modular portfolio platform with admin CRUD, capabilities integration, translations, and dynamic page sections.'),
                'status' => 'in_progress',
                'repository_url' => 'https://github.com/example/portfolio-platform',
                'live_url' => 'https://portfolio.example.com',
                'display' => true,
                'skills' => ['Laravel', 'React', 'TypeScript', 'MySQL', 'Docker'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Plataforma de Portfolio',
                        'summary' => 'Plataforma pessoal modular com secoes gerenciadas por CMS.',
                        'description' => $this->richTextDocument('Plataforma de portfolio modular com CRUD administrativo, integracao de capabilities, traducoes e secoes dinamicas.'),
                        'status' => 'em_andamento',
                        'repository_url' => 'https://github.com/example/portfolio-platform',
                        'live_url' => 'https://portfolio.example.com',
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'E-commerce API',
                'summary' => 'Backend API for catalog, checkout, and order orchestration.',
                'description' => $this->richTextDocument('Scalable API focused on product catalog, payment workflows, stock consistency, and async order processing.'),
                'status' => 'completed',
                'repository_url' => 'https://github.com/example/ecommerce-api',
                'live_url' => null,
                'display' => true,
                'skills' => ['PHP', 'Laravel', 'PostgreSQL', 'Redis', 'REST APIs'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'API de E-commerce',
                        'summary' => 'API backend para catalogo, checkout e orquestracao de pedidos.',
                        'description' => $this->richTextDocument('API escalavel com foco em catalogo de produtos, fluxo de pagamento, consistencia de estoque e processamento assincrono.'),
                        'status' => 'concluido',
                        'repository_url' => 'https://github.com/example/ecommerce-api',
                        'live_url' => null,
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Analytics Dashboard',
                'summary' => 'Real-time metrics dashboard with custom widgets.',
                'description' => $this->richTextDocument('Interactive dashboard with role-based access, visualization widgets, and exportable performance reports.'),
                'status' => 'maintenance',
                'repository_url' => 'https://github.com/example/analytics-dashboard',
                'live_url' => 'https://analytics.example.com',
                'display' => true,
                'skills' => ['Node.js', 'React', 'TypeScript', 'MongoDB', 'Nginx'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Dashboard de Analytics',
                        'summary' => 'Dashboard de metricas em tempo real com widgets customizados.',
                        'description' => $this->richTextDocument('Dashboard interativo com acesso por perfil, widgets de visualizacao e relatorios de performance exportaveis.'),
                        'status' => 'manutencao',
                        'repository_url' => 'https://github.com/example/analytics-dashboard',
                        'live_url' => 'https://analytics.example.com',
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Internal Dev Portal',
                'summary' => 'Internal portal for engineering documentation and tools.',
                'description' => $this->richTextDocument('Centralized engineering portal with documentation indexing, release notes, and internal productivity tools.'),
                'status' => 'planned',
                'repository_url' => null,
                'live_url' => null,
                'display' => false,
                'skills' => ['Vite', 'GitHub Actions', 'Docker', 'Cloudflare'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Portal Interno de Engenharia',
                        'summary' => 'Portal interno para documentacao e ferramentas de engenharia.',
                        'description' => $this->richTextDocument('Portal centralizado com indexacao de documentacao, notas de release e ferramentas internas de produtividade.'),
                        'status' => 'planejado',
                        'repository_url' => null,
                        'live_url' => null,
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Learning Management System',
                'summary' => 'Platform for course publication, progress tracking, and assessments.',
                'description' => $this->richTextDocument('A web platform for publishing lessons, tracking student progress, and providing assessment workflows for instructors.'),
                'status' => 'completed',
                'repository_url' => 'https://github.com/example/lms-platform',
                'live_url' => 'https://learn.example.com',
                'display' => true,
                'skills' => ['Laravel', 'Vue.js', 'MySQL', 'Redis', 'Nginx'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Sistema de Gestao de Aprendizagem',
                        'summary' => 'Plataforma para publicacao de cursos, progresso e avaliacoes.',
                        'description' => $this->richTextDocument('Plataforma web para publicacao de aulas, acompanhamento de progresso e fluxos de avaliacao para instrutores.'),
                        'status' => 'concluido',
                        'repository_url' => 'https://github.com/example/lms-platform',
                        'live_url' => 'https://learn.example.com',
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'DevOps Automation Toolkit',
                'summary' => 'Automation toolkit for CI/CD pipelines and environment provisioning.',
                'description' => $this->richTextDocument('Toolkit focused on reusable CI/CD pipelines, infrastructure provisioning templates, and deployment guardrails.'),
                'status' => 'in_progress',
                'repository_url' => 'https://github.com/example/devops-toolkit',
                'live_url' => null,
                'display' => true,
                'skills' => ['Docker', 'GitHub Actions', 'Terraform', 'Linux', 'CI/CD'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Toolkit de Automacao DevOps',
                        'summary' => 'Toolkit para pipelines CI/CD e provisionamento de ambientes.',
                        'description' => $this->richTextDocument('Toolkit focado em pipelines reutilizaveis de CI/CD, templates de infraestrutura e controles de deploy.'),
                        'status' => 'em_andamento',
                        'repository_url' => 'https://github.com/example/devops-toolkit',
                        'live_url' => null,
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Mobile Habit Tracker',
                'summary' => 'Mobile app for habits, streak tracking, and personal goals.',
                'description' => $this->richTextDocument('Cross-platform mobile application for creating habits, tracking streaks, and visualizing weekly progress.'),
                'status' => 'completed',
                'repository_url' => 'https://github.com/example/habit-tracker',
                'live_url' => null,
                'display' => true,
                'skills' => ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'App Mobile de Habitos',
                        'summary' => 'Aplicativo para habitos, sequencias e metas pessoais.',
                        'description' => $this->richTextDocument('Aplicativo mobile multiplataforma para criar habitos, acompanhar sequencias e visualizar progresso semanal.'),
                        'status' => 'concluido',
                        'repository_url' => 'https://github.com/example/habit-tracker',
                        'live_url' => null,
                    ],
                ],
            ],
            [
                'locale' => 'en',
                'name' => 'Cloud Cost Monitor',
                'summary' => 'Dashboard for cloud spending, alerts, and optimization insights.',
                'description' => $this->richTextDocument('Service that aggregates cloud billing data, triggers threshold alerts, and recommends cost optimization opportunities.'),
                'status' => 'planned',
                'repository_url' => null,
                'live_url' => null,
                'display' => false,
                'skills' => ['AWS', 'Cloudflare', 'Next.js', 'GraphQL'],
                'translations' => [
                    'pt_BR' => [
                        'name' => 'Monitor de Custos em Nuvem',
                        'summary' => 'Dashboard de custos em nuvem com alertas e insights.',
                        'description' => $this->richTextDocument('Servico que agrega dados de faturamento em nuvem, dispara alertas de limite e recomenda oportunidades de otimizacao.'),
                        'status' => 'planejado',
                        'repository_url' => null,
                        'live_url' => null,
                    ],
                ],
            ],
        ];

        $skillIdByName = Skill::query()
            ->pluck('id', 'name')
            ->all();

        foreach ($projects as $projectData) {
            $project = Project::query()->create([
                'locale' => $projectData['locale'],
                'name' => $projectData['name'],
                'summary' => $projectData['summary'],
                'description' => $projectData['description'],
                'status' => $projectData['status'],
                'repository_url' => $projectData['repository_url'],
                'live_url' => $projectData['live_url'],
                'display' => $projectData['display'],
            ]);

            $this->seedProjectTranslations($project, $projectData['translations'] ?? []);
            $this->attachSkills($project, $projectData['skills'] ?? [], $skillIdByName);
            $this->attachSeedImage($project, $imageFilenameByItem[$project->name] ?? null);
        }
    }

    /**
     * @param array<string,array<string,mixed>> $translations
     */
    private function seedProjectTranslations(Project $project, array $translations): void
    {
        foreach ($translations as $locale => $data) {
            if ($locale === $project->locale) {
                continue;
            }

            ProjectTranslation::query()->create([
                'project_id' => $project->id,
                'locale' => $locale,
                'name' => $data['name'] ?? null,
                'summary' => $data['summary'] ?? null,
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? null,
                'repository_url' => $data['repository_url'] ?? null,
                'live_url' => $data['live_url'] ?? null,
            ]);
        }
    }

    /**
     * @param array<int,string> $skillNames
     * @param array<string,int|string> $skillIdByName
     */
    private function attachSkills(Project $project, array $skillNames, array $skillIdByName): void
    {
        $skillIds = [];

        foreach ($skillNames as $skillName) {
            $skillId = $skillIdByName[$skillName] ?? null;

            if ($skillId === null) {
                continue;
            }

            $skillIds[] = (int) $skillId;
        }

        if ($skillIds === []) {
            return;
        }

        $project->skills()->sync($skillIds);
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

    private function attachSeedImage(Project $project, ?string $originalFilename): void
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

        // Slot is unused by projects; keep it null to match runtime behavior.
        $project->images()->syncWithoutDetaching([
            $image->id => [
                'position' => 0,
                'is_cover' => true,
                'caption' => $image->caption ?? $project->name,
            ],
        ]);
    }
}
