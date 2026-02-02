<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Application\UseCases\CreateSkillCategoryTranslation\CreateSkillCategoryTranslation;
use App\Modules\Skills\Application\UseCases\CreateSkillCategoryTranslation\CreateSkillCategoryTranslationInput;
use App\Modules\Skills\Application\UseCases\DeleteSkillCategoryTranslation\DeleteSkillCategoryTranslation;
use App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations\ListSkillCategoryTranslations;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation\UpdateSkillCategoryTranslation;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation\UpdateSkillCategoryTranslationInput;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Http\Requests\SkillCategoryTranslation\StoreSkillCategoryTranslationRequest;
use App\Modules\Skills\Http\Requests\SkillCategoryTranslation\UpdateSkillCategoryTranslationRequest;
use Illuminate\Http\JsonResponse;

final class SkillCategoryTranslationController extends Controller
{
    public function __construct(
        private readonly ListSkillCategoryTranslations $listSkillCategoryTranslations,
        private readonly CreateSkillCategoryTranslation $createSkillCategoryTranslation,
        private readonly UpdateSkillCategoryTranslation $updateSkillCategoryTranslation,
        private readonly DeleteSkillCategoryTranslation $deleteSkillCategoryTranslation,
    ) {
    }

    public function index(SkillCategory $skillCategory): JsonResponse
    {
        $items = $this->listSkillCategoryTranslations->handle($skillCategory);

        return response()->json([
            'data' => array_map(static fn($dto): array => $dto->toArray(), $items),
        ]);
    }

    public function store(
        StoreSkillCategoryTranslationRequest $request,
        SkillCategory $skillCategory,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->createSkillCategoryTranslation->handle(
            new CreateSkillCategoryTranslationInput(
                skillCategoryId: $skillCategory->id,
                locale: $data['locale'],
                name: $data['name'],
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ], 201);
    }

    public function update(
        UpdateSkillCategoryTranslationRequest $request,
        SkillCategory $skillCategory,
        string $locale,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->updateSkillCategoryTranslation->handle(
            new UpdateSkillCategoryTranslationInput(
                skillCategoryId: $skillCategory->id,
                locale: $data['locale'],
                name: $data['name'],
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ]);
    }

    public function destroy(SkillCategory $skillCategory, string $locale): JsonResponse
    {
        $this->deleteSkillCategoryTranslation->handle($skillCategory->id, $locale);

        return response()->json(null, 204);
    }
}
