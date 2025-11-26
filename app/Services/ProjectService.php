<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectImage;
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
    ) {}

    /**
     * Retrieve all projects ordered by most recent first.
     *
     * @return Collection<int,Project>
     */
    public function all(): Collection
    {
        return Project::query()
            ->with(['images', 'technologies'])
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
            ->with(['images', 'technologies'])
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Create a new project with technologies and images.
     *
     * @param array<string,mixed>               $attributes    Project attributes.
     * @param array<int,int>                    $technologyIds Technology primary keys.
     * @param array<int,array<string,mixed>>    $images        Image payloads with uploaded file and optional alt.
     */
    public function create(
        array $attributes,
        array $technologyIds = [],
        array $images = []
    ): Project {
        return DB::transaction(function () use ($attributes, $technologyIds, $images): Project {
            /** @var Project $project */
            $project = Project::query()->create($attributes);

            if (! empty($technologyIds)) {
                $project->technologies()->sync($technologyIds);
            }

            if (! empty($images)) {
                $this->projectImageService->replaceImages($project, $images);
            }

            return $project->load(['images', 'technologies']);
        });
    }

    /**
     * Update a project with technologies and images.
     *
     * Existing technologies are synced and images are replaced
     * only when a new collection is provided.
     *
     * @param array<string,mixed>               $attributes    Project attributes.
     * @param array<int,int>                    $technologyIds Technology primary keys.
     * @param array<int,array<string,mixed>>    $images        Image payloads with uploaded file and optional alt.
     */
    public function update(
        Project $project,
        array $attributes,
        array $technologyIds = [],
        array $images = []
    ): Project {
        return DB::transaction(function () use ($project, $attributes, $technologyIds, $images): Project {
            $project->update($attributes);

            $project->technologies()->sync($technologyIds);

            if (! empty($images)) {
                $this->projectImageService->replaceImages($project, $images);
            }

            return $project->load(['images', 'technologies']);
        });
    }

    /**
     * Delete a single image belonging to a project.
     */
    public function deleteImage(ProjectImage $image): void
    {
        DB::transaction(function () use ($image): void {
            $this->projectImageService->delete($image);
        });
    }

    /**
     * Delete a project and its relations, including image files.
     */
    public function delete(Project $project): void
    {
        DB::transaction(function () use ($project): void {
            $images = $project->images()->get();

            foreach ($images as $image) {
                $this->projectImageService->delete($image);
            }

            $project->delete();
        });
    }
}
