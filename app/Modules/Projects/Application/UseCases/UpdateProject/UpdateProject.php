<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProject;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;
use App\Modules\Projects\Application\Services\ProjectImageService;
use Illuminate\Support\Facades\DB;

final class UpdateProject
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly IProjectTranslationRepository $translations,
        private readonly ProjectImageService $projectImageService,
    ) {
    }

    public function handle(Project $project, UpdateProjectInput $input): Project
    {
        return DB::transaction(function () use ($project, $input): Project {
            if ($input->locale !== $project->locale) {
                $existing = $this->translations->findByProjectAndLocale(
                    $project,
                    $input->locale,
                );
                if ($existing !== null) {
                    $this->translations->delete($existing);
                }
            }

            $this->projects->update($project, [
                'locale' => $input->locale,
                'name' => $input->name,
                'summary' => $input->summary,
                'description' => $input->description,
                'status' => $input->status,
                'repository_url' => $input->repositoryUrl,
                'live_url' => $input->liveUrl,
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
