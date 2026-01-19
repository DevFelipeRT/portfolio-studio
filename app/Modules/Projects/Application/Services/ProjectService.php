<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Services;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Images\Domain\Models\Image;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Service responsible for managing portfolio projects and their relations.
 */
class ProjectService
{
    public function __construct(
        private readonly ProjectImageService $projectImageService,
    ) {
    }

    /**
     * Retrieve all projects ordered by most recent first.
     *
     * @return Collection<int,Project>
     */
    public function all(): Collection
    {
        return Project::query()
            ->with(['images', 'skills.category'])
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();
    }

    /**
     * Return a paginated list of projects ordered by creation date and name.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Project::query()
            ->orderByDesc('created_at')
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * Retrieve only projects flagged for display, ordered by most recent first.
     *
     * @return Collection<int,Project>
     */
    public function visible(): Collection
    {
        return Project::query()
            ->where('display', true)
            ->with(['images', 'skills.category'])
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Create a new project with skills and images.
     *
     * @param array<string,mixed>            $attributes    Project attributes.
     * @param array<int,int>                 $skillIds      Skill primary keys.
     * @param array<int,array<string,mixed>> $images        Image payloads with uploaded file and metadata.
     */
    public function create(
        array $attributes,
        array $skillIds = [],
        array $images = []
    ): Project {
        return DB::transaction(function () use ($attributes, $skillIds, $images): Project {
            /** @var Project $project */
            $project = Project::query()->create($attributes);

            if (!empty($skillIds)) {
                $project->skills()->sync($skillIds);
            }

            if (!empty($images)) {
                $this->projectImageService->replace($project, $images);
            }

            return $project->load(['images', 'skills.category']);
        });
    }

    /**
     * Update a project with skills and images.
     *
     * Existing skills are synced and images are replaced
     * only when a new collection is provided.
     *
     * @param array<string,mixed>            $attributes    Project attributes.
     * @param array<int,int>                 $skillIds      Skill primary keys.
     * @param array<int,array<string,mixed>> $images        Image payloads with uploaded file and metadata.
     */
    public function update(
        Project $project,
        array $attributes,
        array $skillIds = [],
        array $images = []
    ): Project {
        return DB::transaction(function () use ($project, $attributes, $skillIds, $images): Project {
            $project->update($attributes);

            $project->skills()->sync($skillIds);

            if (!empty($images)) {
                $this->projectImageService->replace($project, $images);
            }

            return $project->load(['images', 'skills.category']);
        });
    }

    /**
     * Detach a single image from a project and remove it when it becomes orphaned.
     */
    public function deleteImage(Project $project, Image $image): void
    {
        DB::transaction(function () use ($project, $image): void {
            $this->projectImageService->detach($project, $image);
        });
    }

    /**
     * Delete a project and its relations, including image files when they become orphaned.
     */
    public function delete(Project $project): void
    {
        DB::transaction(function () use ($project): void {
            /** @var Collection<int,Image> $images */
            $images = $project->images()->get();

            foreach ($images as $image) {
                $this->projectImageService->detach($project, $image);
            }

            $project->delete();
        });
    }
}
