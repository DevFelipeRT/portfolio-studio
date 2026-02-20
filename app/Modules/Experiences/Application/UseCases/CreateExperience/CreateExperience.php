<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\CreateExperience;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use App\Modules\Shared\Contracts\RichText\IRichTextService;

final class CreateExperience
{
    public function __construct(
        private readonly IExperienceRepository $experiences,
        private readonly IRichTextService $richText,
    ) {
    }

    public function handle(CreateExperienceInput $input): Experience
    {
        $preparedDescription = $this->richText->prepareForPersistence($input->description, 'description');

        return $this->experiences->create([
            'locale' => $input->locale,
            'position' => $input->position,
            'company' => $input->company,
            'summary' => $input->summary,
            'description' => $preparedDescription->normalized(),
            'start_date' => $input->startDate,
            'end_date' => $input->endDate,
            'display' => $input->display,
        ]);
    }
}
