<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkill;

final class CreateSkillInput
{
    public function __construct(
        public readonly string $name,
        public readonly ?int $skillCategoryId,
    ) {
    }
}
