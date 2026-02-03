<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\CreateExperience;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;

final class CreateExperience
{
    public function __construct(private readonly IExperienceRepository $experiences)
    {
    }

    public function handle(CreateExperienceInput $input): Experience
    {
        return $this->experiences->create([
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
