<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillTranslation;

final readonly class DeleteSkillTranslationOutput
{
    public function __construct(
        public int $skillId,
        public string $locale,
    ) {
    }
}
