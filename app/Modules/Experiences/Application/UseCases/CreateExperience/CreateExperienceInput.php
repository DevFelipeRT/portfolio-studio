<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\CreateExperience;

final class CreateExperienceInput
{
    public function __construct(
        public readonly string $locale,
        public readonly string $position,
        public readonly string $company,
        public readonly ?string $summary,
        public readonly string $description,
        public readonly string $startDate,
        public readonly ?string $endDate,
        public readonly bool $display,
    ) {
    }
}
