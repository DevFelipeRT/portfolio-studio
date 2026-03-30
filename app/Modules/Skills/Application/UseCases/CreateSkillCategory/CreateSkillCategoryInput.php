<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillCategory;

final readonly class CreateSkillCategoryInput
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $slug,
        public readonly string $locale,
    ) {
    }
}
