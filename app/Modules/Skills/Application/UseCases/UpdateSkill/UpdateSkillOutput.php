<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkill;

final readonly class UpdateSkillOutput
{
    public function __construct(
        public int $skillId,
    ) {
    }
}
