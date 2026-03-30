<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkill;

final readonly class CreateSkillOutput
{
    public function __construct(
        public int $skillId,
    ) {
    }
}
