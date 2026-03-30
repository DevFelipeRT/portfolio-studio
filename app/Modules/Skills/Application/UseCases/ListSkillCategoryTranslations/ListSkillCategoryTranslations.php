<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations;

use App\Modules\Skills\Application\Mappers\SkillTranslationOutputMapper;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;

final class ListSkillCategoryTranslations
{
    public function __construct(
        private readonly ISkillCategoryRepository $categories,
        private readonly ISkillCategoryTranslationRepository $translations,
        private readonly SkillTranslationOutputMapper $skillTranslationOutputMapper,
    ) {
    }

    public function handle(
        ListSkillCategoryTranslationsInput $input,
    ): ListSkillCategoryTranslationsOutput
    {
        $category = $this->categories->findById($input->skillCategoryId);
        $items = $this->translations->listByCategory($category);

        return new ListSkillCategoryTranslationsOutput(
            items: $items
                ->map(fn($translation): ListSkillCategoryTranslationItem => $this->skillTranslationOutputMapper->toListSkillCategoryTranslationItem($translation))
                ->all(),
        );
    }
}
