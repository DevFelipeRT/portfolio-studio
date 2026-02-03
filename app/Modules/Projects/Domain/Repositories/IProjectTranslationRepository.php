<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Repositories;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Models\ProjectTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface IProjectTranslationRepository
{
    /**
     * @return EloquentCollection<int,ProjectTranslation>
     */
    public function listByProject(Project $project): EloquentCollection;

    public function findByProjectAndLocale(
        Project $project,
        string $locale,
    ): ?ProjectTranslation;

    public function create(
        Project $project,
        string $locale,
        array $data,
    ): ProjectTranslation;

    public function update(
        ProjectTranslation $translation,
        array $data,
    ): ProjectTranslation;

    public function delete(ProjectTranslation $translation): void;
}
