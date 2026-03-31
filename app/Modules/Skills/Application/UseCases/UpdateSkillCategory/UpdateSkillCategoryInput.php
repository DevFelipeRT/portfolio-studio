<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategory;

final readonly class UpdateSkillCategoryInput
{
    public function __construct(
        public readonly int $skillCategoryId,
        public readonly string $name,
        public readonly ?string $slug,
        public readonly string $locale,
        public readonly bool $confirmSwap,
    ) {
    }
}
