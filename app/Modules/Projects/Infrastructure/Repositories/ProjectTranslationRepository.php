<?php

declare(strict_types=1);

namespace App\Modules\Projects\Infrastructure\Repositories;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Models\ProjectTranslation;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class ProjectTranslationRepository implements IProjectTranslationRepository
{
    public function listByProject(Project $project): EloquentCollection
    {
        return $project->translations()->orderBy('locale')->get();
    }

    public function findByProjectAndLocale(
        Project $project,
        string $locale,
    ): ?ProjectTranslation {
        return $project
            ->translations()
            ->where('locale', $locale)
            ->first();
    }

    public function create(
        Project $project,
        string $locale,
        array $data,
    ): ProjectTranslation {
        return $project->translations()->create([
            'locale' => $locale,
            'name' => $data['name'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? null,
            'repository_url' => $data['repository_url'] ?? null,
            'live_url' => $data['live_url'] ?? null,
        ]);
    }

    public function update(
        ProjectTranslation $translation,
        array $data,
    ): ProjectTranslation {
        $translation->update([
            'name' => $data['name'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? null,
            'repository_url' => $data['repository_url'] ?? null,
            'live_url' => $data['live_url'] ?? null,
        ]);

        return $translation;
    }

    public function delete(ProjectTranslation $translation): void
    {
        $translation->delete();
    }
}
