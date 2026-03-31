<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\DeleteProject;

use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Application\Services\ProjectImageService;
use App\Modules\Images\Domain\Models\Image;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

final class DeleteProject
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly ProjectImageService $projectImageService,
    ) {
    }

    public function handle(DeleteProjectInput $input): DeleteProjectOutput
    {
        return DB::transaction(function () use ($input): DeleteProjectOutput {
            $project = $this->projects->findById($input->projectId);

            /** @var Collection<int,Image> $images */
            $images = $project->images()->get();

            foreach ($images as $image) {
                $this->projectImageService->detach($project, $image);
            }

            $this->projects->delete($project);

            return new DeleteProjectOutput(
                projectId: $project->id,
            );
        });
    }
}
