<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\Services;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;
use Illuminate\Support\Facades\DB;

final class ExperienceLocaleSwapService
{
    public function __construct(
        private readonly IExperienceRepository $experiences,
        private readonly IExperienceTranslationRepository $translations,
    ) {
    }

    public function swap(Experience $experience, string $newLocale): Experience
    {
        return DB::transaction(function () use ($experience, $newLocale): Experience {
            $translation = $this->translations->findByExperienceAndLocale(
                $experience,
                $newLocale,
            );

            if ($translation === null) {
                return $experience;
            }

            $oldLocale = $experience->locale;

            $basePayload = [
                'position' => $experience->position,
                'company' => $experience->company,
                'summary' => $experience->summary,
                'description' => $experience->description,
            ];

            $newBasePayload = [
                'position' => $translation->position,
                'company' => $translation->company,
                'summary' => $translation->summary,
                'description' => $translation->description,
            ];

            $this->experiences->update($experience, [
                'locale' => $newLocale,
                'position' => $newBasePayload['position'],
                'company' => $newBasePayload['company'],
                'summary' => $newBasePayload['summary'],
                'description' => $newBasePayload['description'],
            ]);

            $existingOldTranslation = $this->translations->findByExperienceAndLocale(
                $experience,
                $oldLocale,
            );

            if ($existingOldTranslation !== null) {
                $this->translations->update($existingOldTranslation, $basePayload);
            } else {
                $this->translations->create($experience, $oldLocale, $basePayload);
            }

            $this->translations->delete($translation);

            return $experience->refresh();
        });
    }
}
