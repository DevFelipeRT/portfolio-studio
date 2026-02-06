<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Mappers;

use App\Modules\Projects\Application\UseCases\CreateProject\CreateProjectInput;
use App\Modules\Projects\Application\UseCases\UpdateProject\UpdateProjectInput;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Http\Requests\Project\StoreProjectRequest;
use App\Modules\Projects\Http\Requests\Project\UpdateProjectRequest;

final class ProjectInputMapper
{
    public static function fromStoreRequest(StoreProjectRequest $request): CreateProjectInput
    {
        $data = $request->validated();

        return new CreateProjectInput(
            locale: $data['locale'],
            name: $data['name'],
            summary: $data['summary'],
            description: $data['description'],
            status: $data['status'],
            repositoryUrl: $data['repository_url'] ?? null,
            liveUrl: $data['live_url'] ?? null,
            display: (bool) ($data['display'] ?? false),
            skillIds: $data['skill_ids'] ?? [],
            images: $data['images'] ?? [],
        );
    }

    public static function fromUpdateRequest(
        UpdateProjectRequest $request,
        Project $project,
    ): UpdateProjectInput {
        $data = $request->validated();

        return new UpdateProjectInput(
            locale: $data['locale'],
            confirmSwap: (bool) ($data['confirm_swap'] ?? false),
            name: $data['name'],
            summary: $data['summary'],
            description: $data['description'],
            status: $data['status'],
            repositoryUrl: $data['repository_url'] ?? null,
            liveUrl: $data['live_url'] ?? null,
            display: (bool) ($data['display'] ?? $project->display),
            skillIds: $data['skill_ids'] ?? [],
            images: $data['images'] ?? [],
        );
    }
}
