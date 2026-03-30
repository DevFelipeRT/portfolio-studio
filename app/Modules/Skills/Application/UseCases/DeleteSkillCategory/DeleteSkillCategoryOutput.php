<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillCategory;

final readonly class DeleteSkillCategoryOutput
{
    public function __construct(
        public int $skillCategoryId,
    ) {
    }
}
