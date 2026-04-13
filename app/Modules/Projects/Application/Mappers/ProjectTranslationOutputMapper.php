<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Mappers;

use App\Modules\Projects\Application\UseCases\CreateProjectTranslation\CreateProjectTranslationOutput;
use App\Modules\Projects\Application\UseCases\ListProjectTranslations\ListProjectTranslationItem;
use App\Modules\Projects\Application\UseCases\UpdateProjectTranslation\UpdateProjectTranslationOutput;
use App\Modules\Projects\Domain\Models\ProjectTranslation;

final class ProjectTranslationOutputMapper
{
    public function toCreateOutput(ProjectTranslation $translation): CreateProjectTranslationOutput
    {
        return new CreateProjectTranslationOutput(
            id: $translation->id,
            projectId: $translation->project_id,
            locale: $translation->locale,
            name: $translation->name,
            summary: $translation->summary,
            description: $translation->description,
            repositoryUrl: $translation->repository_url,
            liveUrl: $translation->live_url,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    public function toUpdateOutput(ProjectTranslation $translation): UpdateProjectTranslationOutput
    {
        return new UpdateProjectTranslationOutput(
            id: $translation->id,
            projectId: $translation->project_id,
            locale: $translation->locale,
            name: $translation->name,
            summary: $translation->summary,
            description: $translation->description,
            repositoryUrl: $translation->repository_url,
            liveUrl: $translation->live_url,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    public function toListItem(ProjectTranslation $translation): ListProjectTranslationItem
    {
        return new ListProjectTranslationItem(
            id: $translation->id,
            projectId: $translation->project_id,
            locale: $translation->locale,
            name: $translation->name,
            summary: $translation->summary,
            description: $translation->description,
            repositoryUrl: $translation->repository_url,
            liveUrl: $translation->live_url,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }
}
