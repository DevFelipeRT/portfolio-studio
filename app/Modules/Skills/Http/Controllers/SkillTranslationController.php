<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Application\UseCases\CreateSkillTranslation\CreateSkillTranslation;
use App\Modules\Skills\Application\UseCases\CreateSkillTranslation\CreateSkillTranslationInput;
use App\Modules\Skills\Application\UseCases\DeleteSkillTranslation\DeleteSkillTranslation;
use App\Modules\Skills\Application\UseCases\DeleteSkillTranslation\DeleteSkillTranslationInput;
use App\Modules\Skills\Application\UseCases\ListSkillTranslations\ListSkillTranslations;
use App\Modules\Skills\Application\UseCases\ListSkillTranslations\ListSkillTranslationsInput;
use App\Modules\Skills\Application\UseCases\UpdateSkillTranslation\UpdateSkillTranslation;
use App\Modules\Skills\Application\UseCases\UpdateSkillTranslation\UpdateSkillTranslationInput;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Http\Requests\SkillTranslation\StoreSkillTranslationRequest;
use App\Modules\Skills\Http\Requests\SkillTranslation\UpdateSkillTranslationRequest;
use App\Modules\Skills\Presentation\Presenters\SkillTranslationJsonPresenter;
use Illuminate\Http\JsonResponse;

final class SkillTranslationController extends Controller
{
    public function __construct(
        private readonly ListSkillTranslations $listSkillTranslations,
        private readonly CreateSkillTranslation $createSkillTranslation,
        private readonly UpdateSkillTranslation $updateSkillTranslation,
        private readonly DeleteSkillTranslation $deleteSkillTranslation,
        private readonly SkillTranslationJsonPresenter $skillTranslationJsonPresenter,
    ) {
    }

    public function index(Skill $skill): JsonResponse
    {
        $items = $this->listSkillTranslations->handle(new ListSkillTranslationsInput(
            skillId: $skill->id,
        ));

        return response()->json(
            $this->skillTranslationJsonPresenter->presentSkillList($items),
        );
    }

    public function store(
        StoreSkillTranslationRequest $request,
        Skill $skill,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->createSkillTranslation->handle(
            new CreateSkillTranslationInput(
                skillId: $skill->id,
                locale: $data['locale'],
                name: $data['name'],
            ),
        );

        return response()->json(
            $this->skillTranslationJsonPresenter->presentCreatedSkillTranslation(
                $dto,
            ),
            201,
        );
    }

    public function update(
        UpdateSkillTranslationRequest $request,
        Skill $skill,
        string $locale,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->updateSkillTranslation->handle(
            new UpdateSkillTranslationInput(
                skillId: $skill->id,
                locale: $data['locale'],
                name: $data['name'],
            ),
        );

        return response()->json(
            $this->skillTranslationJsonPresenter->presentUpdatedSkillTranslation(
                $dto,
            ),
        );
    }

    public function destroy(Skill $skill, string $locale): JsonResponse
    {
        $this->deleteSkillTranslation->handle(new DeleteSkillTranslationInput(
            skillId: $skill->id,
            locale: $locale,
        ));

        return response()->json(null, 204);
    }
}
