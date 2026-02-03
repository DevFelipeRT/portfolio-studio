<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Domain\Repositories;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Models\ExperienceTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface IExperienceTranslationRepository
{
    /**
     * @return EloquentCollection<int,ExperienceTranslation>
     */
    public function listByExperience(Experience $experience): EloquentCollection;

    public function findByExperienceAndLocale(
        Experience $experience,
        string $locale,
    ): ?ExperienceTranslation;

    public function create(
        Experience $experience,
        string $locale,
        array $data,
    ): ExperienceTranslation;

    public function update(
        ExperienceTranslation $translation,
        array $data,
    ): ExperienceTranslation;

    public function delete(ExperienceTranslation $translation): void;
}
