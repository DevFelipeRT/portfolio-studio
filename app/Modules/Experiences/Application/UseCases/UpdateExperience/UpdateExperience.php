<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\UpdateExperience;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;
use App\Modules\Experiences\Application\Services\ExperienceLocaleSwapService;
use Illuminate\Support\Facades\DB;

final class UpdateExperience
{
    public function __construct(
        private readonly IExperienceRepository $experiences,
        private readonly IExperienceTranslationRepository $translations,
        private readonly ExperienceLocaleSwapService $localeSwapService,
    ) {
    }

    public function handle(Experience $experience, UpdateExperienceInput $input): Experience
    {
        return DB::transaction(function () use ($experience, $input): Experience {
            $localeChanged = $input->locale !== $experience->locale;
            $shouldSwap = false;

            if ($localeChanged) {
                $existing = $this->translations->findByExperienceAndLocale(
                    $experience,
                    $input->locale,
                );
                $shouldSwap = $existing !== null && $input->confirmSwap;
            }

            if ($shouldSwap) {
                $experience = $this->localeSwapService->swap($experience, $input->locale);
            } else {
                $this->experiences->update($experience, [
                    'locale' => $input->locale,
                    'position' => $input->position,
                    'company' => $input->company,
                    'summary' => $input->summary,
                    'description' => $input->description,
                ]);
            }

            return $this->experiences->update($experience, [
                'start_date' => $input->startDate,
                'end_date' => $input->endDate,
                'display' => $input->display,
            ]);
        });
    }
}
