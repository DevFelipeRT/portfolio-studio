<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Mappers;

use App\Modules\Skills\Application\UseCases\CreateSkillCategory\CreateSkillCategoryInput;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategory\UpdateSkillCategoryInput;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Http\Requests\SkillCategory\StoreSkillCategoryRequest;
use App\Modules\Skills\Http\Requests\SkillCategory\UpdateSkillCategoryRequest;

final class SkillCategoryInputMapper
{
    public static function fromStoreRequest(
        StoreSkillCategoryRequest $request,
    ): CreateSkillCategoryInput {
        $data = $request->validated();

        return new CreateSkillCategoryInput(
            name: $data['name'],
            slug: $data['slug'] ?? null,
        );
    }

    public static function fromUpdateRequest(
        UpdateSkillCategoryRequest $request,
        SkillCategory $category,
    ): UpdateSkillCategoryInput {
        $data = $request->validated();

        return new UpdateSkillCategoryInput(
            name: $data['name'],
            slug: $data['slug'] ?? null,
        );
    }
}
