<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\ListExperienceTranslations;

use App\Modules\Experiences\Application\Dtos\ExperienceTranslationDto;
use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;

final class ListExperienceTranslations
{
    public function __construct(
        private readonly IExperienceTranslationRepository $translations,
    ) {
    }

    /**
     * @return array<int,ExperienceTranslationDto>
     */
    public function handle(Experience $experience): array
    {
        return $this->translations
            ->listByExperience($experience)
            ->map(static fn($translation): ExperienceTranslationDto => ExperienceTranslationDto::fromModel($translation))
            ->all();
    }
}
