<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillCategory;

final readonly class CreateSkillCategoryOutput
{
    public function __construct(
        public int $skillCategoryId,
    ) {
    }
}
