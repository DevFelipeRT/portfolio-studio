<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategory;

final class UpdateSkillCategoryInput
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $slug,
        public readonly string $locale,
    ) {
    }
}
