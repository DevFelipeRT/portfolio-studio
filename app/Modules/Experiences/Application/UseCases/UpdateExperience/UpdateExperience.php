<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\UpdateExperience;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;

final class UpdateExperience
{
    public function __construct(
        private readonly IExperienceRepository $experiences,
        private readonly IExperienceTranslationRepository $translations,
    ) {
    }

    public function handle(Experience $experience, UpdateExperienceInput $input): Experience
    {
        if ($input->locale !== $experience->locale) {
            $existing = $this->translations->findByExperienceAndLocale(
                $experience,
                $input->locale,
            );
            if ($existing !== null) {
                $this->translations->delete($existing);
            }
        }

        return $this->experiences->update($experience, [
            'locale' => $input->locale,
            'position' => $input->position,
            'company' => $input->company,
            'summary' => $input->summary,
            'description' => $input->description,
            'start_date' => $input->startDate,
            'end_date' => $input->endDate,
            'display' => $input->display,
        ]);
    }
}
