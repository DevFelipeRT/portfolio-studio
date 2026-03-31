<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategory;

final readonly class UpdateSkillCategoryOutput
{
    public function __construct(
        public int $skillCategoryId,
    ) {
    }
}
