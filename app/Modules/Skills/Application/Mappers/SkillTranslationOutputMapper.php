<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Mappers;

use App\Modules\Skills\Application\UseCases\CreateSkillCategoryTranslation\CreateSkillCategoryTranslationOutput;
use App\Modules\Skills\Application\UseCases\CreateSkillTranslation\CreateSkillTranslationOutput;
use App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations\ListSkillCategoryTranslationItem;
use App\Modules\Skills\Application\UseCases\ListSkillTranslations\ListSkillTranslationItem;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation\UpdateSkillCategoryTranslationOutput;
use App\Modules\Skills\Application\UseCases\UpdateSkillTranslation\UpdateSkillTranslationOutput;
use App\Modules\Skills\Domain\Models\SkillCategoryTranslation;
use App\Modules\Skills\Domain\Models\SkillTranslation;

final class SkillTranslationOutputMapper
{
    public function toCreateSkillTranslationOutput(
        SkillTranslation $translation,
    ): CreateSkillTranslationOutput {
        return new CreateSkillTranslationOutput(
            id: $translation->id,
            skillId: $translation->skill_id,
            locale: $translation->locale,
            name: $translation->name,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    public function toUpdateSkillTranslationOutput(
        SkillTranslation $translation,
    ): UpdateSkillTranslationOutput {
        return new UpdateSkillTranslationOutput(
            id: $translation->id,
            skillId: $translation->skill_id,
            locale: $translation->locale,
            name: $translation->name,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    public function toListSkillTranslationItem(
        SkillTranslation $translation,
    ): ListSkillTranslationItem {
        return new ListSkillTranslationItem(
            id: $translation->id,
            skillId: $translation->skill_id,
            locale: $translation->locale,
            name: $translation->name,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    public function toCreateSkillCategoryTranslationOutput(
        SkillCategoryTranslation $translation,
    ): CreateSkillCategoryTranslationOutput {
        return new CreateSkillCategoryTranslationOutput(
            id: $translation->id,
            skillCategoryId: $translation->skill_category_id,
            locale: $translation->locale,
            name: $translation->name,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    public function toUpdateSkillCategoryTranslationOutput(
        SkillCategoryTranslation $translation,
    ): UpdateSkillCategoryTranslationOutput {
        return new UpdateSkillCategoryTranslationOutput(
            id: $translation->id,
            skillCategoryId: $translation->skill_category_id,
            locale: $translation->locale,
            name: $translation->name,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    public function toListSkillCategoryTranslationItem(
        SkillCategoryTranslation $translation,
    ): ListSkillCategoryTranslationItem {
        return new ListSkillCategoryTranslationItem(
            id: $translation->id,
            skillCategoryId: $translation->skill_category_id,
            locale: $translation->locale,
            name: $translation->name,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }
}
