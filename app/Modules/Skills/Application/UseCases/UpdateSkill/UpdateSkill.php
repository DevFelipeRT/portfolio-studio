<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkill;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Dtos\SkillDto;
use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;

final class UpdateSkill
{
    public function __construct(
        private readonly ISkillRepository $repository,
        private readonly SkillTranslationResolver $translationResolver,
    ) {
    }

    public function handle(Skill $skill, UpdateSkillInput $input): SkillDto
    {
        $updated = $this->repository->update($skill, [
            'name' => $input->name,
            'skill_category_id' => $input->skillCategoryId,
        ]);

        $updated->loadMissing('category', 'translations', 'category.translations');

        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $categoryDto = null;
        if ($updated->category !== null) {
            $categoryName = $this->translationResolver->resolveCategoryName(
                $updated->category,
                $locale,
                $fallbackLocale,
            );
            $categoryDto = SkillCategoryDto::fromModel($updated->category, $categoryName);
        }

        $skillName = $this->translationResolver->resolveSkillName(
            $updated,
            $locale,
            $fallbackLocale,
        );

        return SkillDto::fromModel($updated, $skillName, $categoryDto);
    }
}
