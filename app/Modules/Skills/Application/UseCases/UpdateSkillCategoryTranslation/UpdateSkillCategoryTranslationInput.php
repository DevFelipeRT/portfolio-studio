<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation;

final class UpdateSkillCategoryTranslationInput
{
    public function __construct(
        public readonly int $skillCategoryId,
        public readonly string $locale,
        public readonly string $name,
    ) {
    }
}
