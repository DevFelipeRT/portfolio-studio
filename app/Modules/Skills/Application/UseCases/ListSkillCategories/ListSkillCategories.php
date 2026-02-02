<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategories;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;

final class ListSkillCategories
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
        private readonly SkillTranslationResolver $translationResolver,
    ) {
    }

    /**
     * @return array<int,SkillCategoryDto>
     */
    public function handle(): array
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $categories = $this->repository->allOrderedWithTranslations(
            $locale,
            $fallbackLocale,
        );

        return $categories
            ->map(function ($category) use ($locale, $fallbackLocale): SkillCategoryDto {
                $name = $this->translationResolver->resolveCategoryName(
                    $category,
                    $locale,
                    $fallbackLocale,
                );

                return SkillCategoryDto::fromModel($category, $name);
            })
            ->all();
    }
}
