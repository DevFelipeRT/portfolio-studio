<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Projects\Application\UseCases\CreateProjectTranslation\CreateProjectTranslation;
use App\Modules\Projects\Application\UseCases\CreateProjectTranslation\CreateProjectTranslationInput;
use App\Modules\Projects\Application\UseCases\DeleteProjectTranslation\DeleteProjectTranslation;
use App\Modules\Projects\Application\UseCases\ListProjectTranslations\ListProjectTranslations;
use App\Modules\Projects\Application\UseCases\UpdateProjectTranslation\UpdateProjectTranslation;
use App\Modules\Projects\Application\UseCases\UpdateProjectTranslation\UpdateProjectTranslationInput;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Http\Requests\ProjectTranslation\StoreProjectTranslationRequest;
use App\Modules\Projects\Http\Requests\ProjectTranslation\UpdateProjectTranslationRequest;
use Illuminate\Http\JsonResponse;

final class ProjectTranslationController extends Controller
{
    public function __construct(
        private readonly ListProjectTranslations $listProjectTranslations,
        private readonly CreateProjectTranslation $createProjectTranslation,
        private readonly UpdateProjectTranslation $updateProjectTranslation,
        private readonly DeleteProjectTranslation $deleteProjectTranslation,
    ) {
    }

    public function index(Project $project): JsonResponse
    {
        $items = $this->listProjectTranslations->handle($project);

        return response()->json([
            'data' => array_map(static fn($dto): array => $dto->toArray(), $items),
        ]);
    }

    public function store(
        StoreProjectTranslationRequest $request,
        Project $project,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->createProjectTranslation->handle(
            new CreateProjectTranslationInput(
                projectId: $project->id,
                locale: $data['locale'],
                name: $data['name'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
                repositoryUrl: $data['repository_url'] ?? null,
                liveUrl: $data['live_url'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ], 201);
    }

    public function update(
        UpdateProjectTranslationRequest $request,
        Project $project,
        string $locale,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->updateProjectTranslation->handle(
            new UpdateProjectTranslationInput(
                projectId: $project->id,
                locale: $data['locale'],
                name: $data['name'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
                repositoryUrl: $data['repository_url'] ?? null,
                liveUrl: $data['live_url'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ]);
    }

    public function destroy(Project $project, string $locale): JsonResponse
    {
        $this->deleteProjectTranslation->handle($project->id, $locale);

        return response()->json(null, 204);
    }
}
