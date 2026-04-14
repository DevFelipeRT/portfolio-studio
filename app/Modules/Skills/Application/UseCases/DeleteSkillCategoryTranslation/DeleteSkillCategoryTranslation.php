<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillCategoryTranslation;

use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class DeleteSkillCategoryTranslation
{
    public function __construct(
        private readonly ISkillCategoryRepository $categories,
        private readonly ISkillCategoryTranslationRepository $translations,
    ) {
    }

    public function handle(
        DeleteSkillCategoryTranslationInput $input,
    ): DeleteSkillCategoryTranslationOutput
    {
        $category = $this->categories->findById($input->skillCategoryId);

        $existing = $this->translations->findByCategoryAndLocale($category, $input->locale);
        if ($existing === null) {
            throw new NotFoundHttpException('Skill category translation not found for this locale.');
        }

        $this->translations->delete($existing);

        return new DeleteSkillCategoryTranslationOutput(
            skillCategoryId: $category->id,
            locale: $input->locale,
        );
    }
}
