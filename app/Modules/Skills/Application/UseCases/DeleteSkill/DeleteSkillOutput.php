<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkill;

final readonly class DeleteSkillOutput
{
    public function __construct(
        public int $skillId,
    ) {
    }
}
