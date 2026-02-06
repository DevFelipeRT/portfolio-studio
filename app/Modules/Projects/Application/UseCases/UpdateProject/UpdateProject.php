<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProject;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;
use App\Modules\Projects\Application\Services\ProjectImageService;
use App\Modules\Projects\Application\Services\ProjectLocaleSwapService;
use Illuminate\Support\Facades\DB;

final class UpdateProject
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly IProjectTranslationRepository $translations,
        private readonly ProjectImageService $projectImageService,
        private readonly ProjectLocaleSwapService $localeSwapService,
    ) {
    }

    public function handle(Project $project, UpdateProjectInput $input): Project
    {
        return DB::transaction(function () use ($project, $input): Project {
            $localeChanged = $input->locale !== $project->locale;
            $shouldSwap = false;

            if ($localeChanged) {
                $existing = $this->translations->findByProjectAndLocale(
                    $project,
                    $input->locale,
                );
                $shouldSwap = $existing !== null && $input->confirmSwap;
            }

            if ($shouldSwap) {
                $project = $this->localeSwapService->swap($project, $input->locale);
            } else {
                $this->projects->update($project, [
                    'locale' => $input->locale,
                    'name' => $input->name,
                    'summary' => $input->summary,
                    'description' => $input->description,
                    'status' => $input->status,
                    'repository_url' => $input->repositoryUrl,
                    'live_url' => $input->liveUrl,
                ]);
            }

            $this->projects->update($project, [
                'display' => $input->display,
            ]);

            $project->skills()->sync($input->skillIds);

            if ($input->images !== []) {
                $this->projectImageService->replace($project, $input->images);
            }

            return $project->load(['images', 'skills.category']);
        });
    }
}
