<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Initiatives\Application\UseCases\CreateInitiativeTranslation\CreateInitiativeTranslation;
use App\Modules\Initiatives\Application\UseCases\CreateInitiativeTranslation\CreateInitiativeTranslationInput;
use App\Modules\Initiatives\Application\UseCases\DeleteInitiativeTranslation\DeleteInitiativeTranslation;
use App\Modules\Initiatives\Application\UseCases\ListInitiativeTranslations\ListInitiativeTranslations;
use App\Modules\Initiatives\Application\UseCases\UpdateInitiativeTranslation\UpdateInitiativeTranslation;
use App\Modules\Initiatives\Application\UseCases\UpdateInitiativeTranslation\UpdateInitiativeTranslationInput;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Http\Requests\InitiativeTranslation\StoreInitiativeTranslationRequest;
use App\Modules\Initiatives\Http\Requests\InitiativeTranslation\UpdateInitiativeTranslationRequest;
use Illuminate\Http\JsonResponse;

final class InitiativeTranslationController extends Controller
{
    public function __construct(
        private readonly ListInitiativeTranslations $listInitiativeTranslations,
        private readonly CreateInitiativeTranslation $createInitiativeTranslation,
        private readonly UpdateInitiativeTranslation $updateInitiativeTranslation,
        private readonly DeleteInitiativeTranslation $deleteInitiativeTranslation,
    ) {
    }

    public function index(Initiative $initiative): JsonResponse
    {
        $items = $this->listInitiativeTranslations->handle($initiative);

        return response()->json([
            'data' => array_map(static fn($dto): array => $dto->toArray(), $items),
        ]);
    }

    public function store(
        StoreInitiativeTranslationRequest $request,
        Initiative $initiative,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->createInitiativeTranslation->handle(
            new CreateInitiativeTranslationInput(
                initiativeId: $initiative->id,
                locale: $data['locale'],
                name: $data['name'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ], 201);
    }

    public function update(
        UpdateInitiativeTranslationRequest $request,
        Initiative $initiative,
        string $locale,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->updateInitiativeTranslation->handle(
            new UpdateInitiativeTranslationInput(
                initiativeId: $initiative->id,
                locale: $data['locale'],
                name: $data['name'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ]);
    }

    public function destroy(Initiative $initiative, string $locale): JsonResponse
    {
        $this->deleteInitiativeTranslation->handle($initiative->id, $locale);

        return response()->json(null, 204);
    }
}
