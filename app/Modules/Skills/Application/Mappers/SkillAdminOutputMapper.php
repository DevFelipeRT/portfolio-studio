<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Mappers;

use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategoryItem;
use App\Modules\Skills\Application\UseCases\ListSkills\ListSkillItem;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Models\SkillCategory;

final class SkillAdminOutputMapper
{
    public function __construct(
        private readonly SkillTranslationResolver $translationResolver,
    ) {
    }

    public function toListSkillItem(
        Skill $skill,
        ?string $locale = null,
        ?string $fallbackLocale = null,
        bool $useTranslations = false,
    ): ListSkillItem {
        $resolvedName = $useTranslations
            ? $this->translationResolver->resolveSkillName(
                $skill,
                $locale,
                $fallbackLocale,
            )
            : $skill->name;

        $category = null;
        if ($skill->category !== null) {
            $categoryName = $useTranslations
                ? $this->translationResolver->resolveCategoryName(
                    $skill->category,
                    $locale,
                    $fallbackLocale,
                )
                : $skill->category->name;

            $category = [
                'id' => $skill->category->id,
                'name' => $categoryName,
            ];
        }

        return new ListSkillItem(
            id: $skill->id,
            name: $resolvedName,
            locale: $skill->locale,
            skillCategoryId: $skill->skill_category_id,
            category: $category,
            createdAt: $skill->created_at?->toJSON(),
            updatedAt: $skill->updated_at?->toJSON(),
        );
    }

    public function toListSkillCategoryItem(
        SkillCategory $category,
        ?string $locale = null,
        ?string $fallbackLocale = null,
        bool $useTranslations = false,
    ): ListSkillCategoryItem {
        $resolvedName = $useTranslations
            ? $this->translationResolver->resolveCategoryName(
                $category,
                $locale,
                $fallbackLocale,
            )
            : $category->name;

        return new ListSkillCategoryItem(
            id: $category->id,
            name: $resolvedName,
            slug: $category->slug,
            locale: $category->locale,
            createdAt: $category->created_at?->toJSON(),
            updatedAt: $category->updated_at?->toJSON(),
        );
    }
}
