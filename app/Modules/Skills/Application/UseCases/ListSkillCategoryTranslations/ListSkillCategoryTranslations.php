<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations;

use App\Modules\Skills\Application\Dtos\SkillCategoryTranslationDto;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;

final class ListSkillCategoryTranslations
{
    public function __construct(
        private readonly ISkillCategoryTranslationRepository $translations,
    ) {
    }

    /**
     * @return array<int,SkillCategoryTranslationDto>
     */
    public function handle(SkillCategory $category): array
    {
        $items = $this->translations->listByCategory($category);

        return $items
            ->map(static fn($translation): SkillCategoryTranslationDto => SkillCategoryTranslationDto::fromModel($translation))
            ->all();
    }
}
