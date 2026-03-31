<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations;

final readonly class ListSkillCategoryTranslationsInput
{
    public function __construct(
        public int $skillCategoryId,
    ) {
    }
}
