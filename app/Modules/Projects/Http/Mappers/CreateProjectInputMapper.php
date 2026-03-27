<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Mappers;

use App\Modules\Projects\Application\UseCases\CreateProject\CreateProjectInput;
use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;
use App\Modules\Projects\Http\Requests\Project\StoreProjectRequest;

final class CreateProjectInputMapper
{
    public function fromRequest(StoreProjectRequest $request): CreateProjectInput
    {
        $data = $request->validated();

        return new CreateProjectInput(
            locale: $data['locale'],
            name: $data['name'],
            summary: $data['summary'],
            description: $data['description'],
            status: ProjectStatus::fromScalar($data['status']),
            repositoryUrl: $data['repository_url'] ?? null,
            liveUrl: $data['live_url'] ?? null,
            display: (bool) ($data['display'] ?? false),
            skillIds: $data['skill_ids'] ?? [],
            images: $data['images'] ?? [],
        );
    }
}
