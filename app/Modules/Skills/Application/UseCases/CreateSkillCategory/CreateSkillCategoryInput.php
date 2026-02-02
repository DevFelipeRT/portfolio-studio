<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillCategory;

final class CreateSkillCategoryInput
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $slug,
    ) {
    }
}
