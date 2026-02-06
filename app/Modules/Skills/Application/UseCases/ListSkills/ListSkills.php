<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkills;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Dtos\SkillDto;
use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;

final class ListSkills
{
    public function __construct(
        private readonly ISkillRepository $repository,
        private readonly SkillTranslationResolver $translationResolver,
    ) {
    }

    /**
     * @return array<int,SkillDto>
     */
    public function handle(
        ?string $locale = null,
        ?string $fallbackLocale = null,
        bool $useTranslations = false,
    ): array
    {
        if ($useTranslations) {
            $locale ??= app()->getLocale();
            $fallbackLocale ??= app()->getFallbackLocale();

            $skills = $this->repository->allWithCategoryAndTranslations(
                $locale,
                $fallbackLocale,
            );

            return $skills
                ->map(function ($skill) use ($locale, $fallbackLocale): SkillDto {
                    $categoryDto = null;

                    if ($skill->category !== null) {
                        $categoryName = $this->translationResolver->resolveCategoryName(
                            $skill->category,
                            $locale,
                            $fallbackLocale,
                        );
                        $categoryDto = SkillCategoryDto::fromModel($skill->category, $categoryName);
                    }

                    $skillName = $this->translationResolver->resolveSkillName(
                        $skill,
                        $locale,
                        $fallbackLocale,
                    );

                    return SkillDto::fromModel($skill, $skillName, $categoryDto);
                })
                ->all();
        }

        $skills = $this->repository->allWithCategory();

        return $skills
            ->map(function ($skill): SkillDto {
                $categoryDto = null;

                if ($skill->category !== null) {
                    $categoryDto = SkillCategoryDto::fromModel($skill->category);
                }

                return SkillDto::fromModel($skill, null, $categoryDto);
            })
            ->all();
    }
}
