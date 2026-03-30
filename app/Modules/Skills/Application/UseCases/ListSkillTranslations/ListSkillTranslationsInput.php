<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillTranslations;

final readonly class ListSkillTranslationsInput
{
    public function __construct(
        public int $skillId,
    ) {
    }
}
