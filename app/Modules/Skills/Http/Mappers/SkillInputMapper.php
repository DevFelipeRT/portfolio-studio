<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Mappers;

use App\Modules\Skills\Application\UseCases\CreateSkill\CreateSkillInput;
use App\Modules\Skills\Application\UseCases\UpdateSkill\UpdateSkillInput;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Http\Requests\Skill\StoreSkillRequest;
use App\Modules\Skills\Http\Requests\Skill\UpdateSkillRequest;

final class SkillInputMapper
{
    public static function fromStoreRequest(StoreSkillRequest $request): CreateSkillInput
    {
        $data = $request->validated();

        return new CreateSkillInput(
            name: $data['name'],
            locale: $data['locale'],
            skillCategoryId: $data['skill_category_id'] ?? null,
        );
    }

    public static function fromUpdateRequest(
        UpdateSkillRequest $request,
        Skill $skill,
    ): UpdateSkillInput {
        $data = $request->validated();

        return new UpdateSkillInput(
            name: $data['name'],
            locale: $data['locale'],
            skillCategoryId: $data['skill_category_id'] ?? null,
        );
    }
}
