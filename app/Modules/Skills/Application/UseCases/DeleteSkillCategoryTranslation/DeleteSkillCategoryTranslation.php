<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillCategoryTranslation;

use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use InvalidArgumentException;

final class DeleteSkillCategoryTranslation
{
    public function __construct(
        private readonly ISkillCategoryRepository $categories,
        private readonly ISkillCategoryTranslationRepository $translations,
    ) {
    }

    public function handle(int $categoryId, string $locale): void
    {
        $category = $this->categories->findById($categoryId);

        $existing = $this->translations->findByCategoryAndLocale($category, $locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Skill category translation not found for this locale.');
        }

        $this->translations->delete($existing);
    }
}
