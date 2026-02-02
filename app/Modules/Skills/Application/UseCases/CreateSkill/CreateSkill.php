<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkill;

use App\Modules\Skills\Application\Dtos\SkillDto;
use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;

final class CreateSkill
{
    public function __construct(
        private readonly ISkillRepository $repository,
        private readonly SkillTranslationResolver $translationResolver,
    ) {
    }

    public function handle(CreateSkillInput $input): SkillDto
    {
        $skill = $this->repository->create([
            'name' => $input->name,
            'skill_category_id' => $input->skillCategoryId,
        ]);

        $skill->loadMissing('category', 'translations', 'category.translations');

        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

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
    }
}
