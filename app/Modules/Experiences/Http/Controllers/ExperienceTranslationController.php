<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Experiences\Application\UseCases\CreateExperienceTranslation\CreateExperienceTranslation;
use App\Modules\Experiences\Application\UseCases\CreateExperienceTranslation\CreateExperienceTranslationInput;
use App\Modules\Experiences\Application\UseCases\DeleteExperienceTranslation\DeleteExperienceTranslation;
use App\Modules\Experiences\Application\UseCases\ListExperienceTranslations\ListExperienceTranslations;
use App\Modules\Experiences\Application\UseCases\UpdateExperienceTranslation\UpdateExperienceTranslation;
use App\Modules\Experiences\Application\UseCases\UpdateExperienceTranslation\UpdateExperienceTranslationInput;
use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Http\Requests\ExperienceTranslation\StoreExperienceTranslationRequest;
use App\Modules\Experiences\Http\Requests\ExperienceTranslation\UpdateExperienceTranslationRequest;
use Illuminate\Http\JsonResponse;

final class ExperienceTranslationController extends Controller
{
    public function __construct(
        private readonly ListExperienceTranslations $listExperienceTranslations,
        private readonly CreateExperienceTranslation $createExperienceTranslation,
        private readonly UpdateExperienceTranslation $updateExperienceTranslation,
        private readonly DeleteExperienceTranslation $deleteExperienceTranslation,
    ) {
    }

    public function index(Experience $experience): JsonResponse
    {
        $items = $this->listExperienceTranslations->handle($experience);

        return response()->json([
            'data' => array_map(static fn($dto): array => $dto->toArray(), $items),
        ]);
    }

    public function store(
        StoreExperienceTranslationRequest $request,
        Experience $experience,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->createExperienceTranslation->handle(
            new CreateExperienceTranslationInput(
                experienceId: $experience->id,
                locale: $data['locale'],
                position: $data['position'] ?? null,
                company: $data['company'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ], 201);
    }

    public function update(
        UpdateExperienceTranslationRequest $request,
        Experience $experience,
        string $locale,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->updateExperienceTranslation->handle(
            new UpdateExperienceTranslationInput(
                experienceId: $experience->id,
                locale: $data['locale'],
                position: $data['position'] ?? null,
                company: $data['company'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ]);
    }

    public function destroy(Experience $experience, string $locale): JsonResponse
    {
        $this->deleteExperienceTranslation->handle($experience->id, $locale);

        return response()->json(null, 204);
    }
}
