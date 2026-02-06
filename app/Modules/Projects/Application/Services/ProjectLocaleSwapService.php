<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Services;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;
use Illuminate\Support\Facades\DB;

final class ProjectLocaleSwapService
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly IProjectTranslationRepository $translations,
    ) {
    }

    public function swap(Project $project, string $newLocale): Project
    {
        return DB::transaction(function () use ($project, $newLocale): Project {
            $translation = $this->translations->findByProjectAndLocale($project, $newLocale);

            if ($translation === null) {
                return $project;
            }

            $oldLocale = $project->locale;

            $basePayload = [
                'name' => $project->name,
                'summary' => $project->summary,
                'description' => $project->description,
                'repository_url' => $project->repository_url,
                'live_url' => $project->live_url,
                'status' => $project->status,
            ];

            $newBasePayload = [
                'name' => $translation->name,
                'summary' => $translation->summary,
                'description' => $translation->description,
                'repository_url' => $translation->repository_url,
                'live_url' => $translation->live_url,
                'status' => $translation->status,
            ];

            $this->projects->update($project, [
                'locale' => $newLocale,
                'name' => $newBasePayload['name'],
                'summary' => $newBasePayload['summary'],
                'description' => $newBasePayload['description'],
                'repository_url' => $newBasePayload['repository_url'],
                'live_url' => $newBasePayload['live_url'],
                'status' => $newBasePayload['status'],
            ]);

            $existingOldTranslation = $this->translations->findByProjectAndLocale(
                $project,
                $oldLocale,
            );

            if ($existingOldTranslation !== null) {
                $this->translations->update($existingOldTranslation, $basePayload);
            } else {
                $this->translations->create($project, $oldLocale, $basePayload);
            }

            $this->translations->delete($translation);

            return $project->refresh();
        });
    }
}
