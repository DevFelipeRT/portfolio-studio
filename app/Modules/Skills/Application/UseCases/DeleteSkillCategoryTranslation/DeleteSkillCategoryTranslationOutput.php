<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillCategoryTranslation;

final readonly class DeleteSkillCategoryTranslationOutput
{
    public function __construct(
        public int $skillCategoryId,
        public string $locale,
    ) {
    }
}
