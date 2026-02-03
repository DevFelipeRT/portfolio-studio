<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\DeleteExperienceTranslation;

use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;
use InvalidArgumentException;

final class DeleteExperienceTranslation
{
    public function __construct(
        private readonly IExperienceRepository $experiences,
        private readonly IExperienceTranslationRepository $translations,
    ) {
    }

    public function handle(int $experienceId, string $locale): void
    {
        $experience = $this->experiences->findById($experienceId);

        $existing = $this->translations->findByExperienceAndLocale($experience, $locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Experience translation not found for this locale.');
        }

        $this->translations->delete($existing);
    }
}
