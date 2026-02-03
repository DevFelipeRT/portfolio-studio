<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Infrastructure\Repositories;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Models\ExperienceTranslation;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class ExperienceTranslationRepository implements IExperienceTranslationRepository
{
    public function listByExperience(Experience $experience): EloquentCollection
    {
        return $experience->translations()->orderBy('locale')->get();
    }

    public function findByExperienceAndLocale(
        Experience $experience,
        string $locale,
    ): ?ExperienceTranslation {
        return $experience
            ->translations()
            ->where('locale', $locale)
            ->first();
    }

    public function create(
        Experience $experience,
        string $locale,
        array $data,
    ): ExperienceTranslation {
        return $experience->translations()->create([
            'locale' => $locale,
            'position' => $data['position'] ?? null,
            'company' => $data['company'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
        ]);
    }

    public function update(
        ExperienceTranslation $translation,
        array $data,
    ): ExperienceTranslation {
        $translation->update([
            'position' => $data['position'] ?? null,
            'company' => $data['company'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        return $translation;
    }

    public function delete(ExperienceTranslation $translation): void
    {
        $translation->delete();
    }
}
