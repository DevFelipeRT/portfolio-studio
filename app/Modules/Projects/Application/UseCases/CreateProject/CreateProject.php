<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\CreateProject;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Application\Services\ProjectImageService;
use Illuminate\Support\Facades\DB;

final class CreateProject
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly ProjectImageService $projectImageService,
    ) {
    }

    public function handle(CreateProjectInput $input): Project
    {
        return DB::transaction(function () use ($input): Project {
            $project = $this->projects->create([
                'locale' => $input->locale,
                'name' => $input->name,
                'summary' => $input->summary,
                'description' => $input->description,
                'status' => $input->status,
                'repository_url' => $input->repositoryUrl,
                'live_url' => $input->liveUrl,
                'display' => $input->display,
            ]);

            if ($input->skillIds !== []) {
                $project->skills()->sync($input->skillIds);
            }

            if ($input->images !== []) {
                $this->projectImageService->replace($project, $input->images);
            }

            return $project->load(['images', 'skills.category']);
        });
    }
}
