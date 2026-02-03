<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\UpdateExperienceTranslation;

final class UpdateExperienceTranslationInput
{
    public function __construct(
        public readonly int $experienceId,
        public readonly string $locale,
        public readonly ?string $position,
        public readonly ?string $company,
        public readonly ?string $summary,
        public readonly ?string $description,
    ) {
    }
}
