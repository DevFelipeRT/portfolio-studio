<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillTranslation;

final class CreateSkillTranslationInput
{
    public function __construct(
        public readonly int $skillId,
        public readonly string $locale,
        public readonly string $name,
    ) {
    }
}
