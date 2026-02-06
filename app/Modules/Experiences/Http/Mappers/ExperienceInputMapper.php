<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Http\Mappers;

use App\Modules\Experiences\Application\UseCases\CreateExperience\CreateExperienceInput;
use App\Modules\Experiences\Application\UseCases\UpdateExperience\UpdateExperienceInput;
use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Http\Requests\Experience\StoreExperienceRequest;
use App\Modules\Experiences\Http\Requests\Experience\UpdateExperienceRequest;

final class ExperienceInputMapper
{
    public static function fromStoreRequest(StoreExperienceRequest $request): CreateExperienceInput
    {
        $data = $request->validated();

        return new CreateExperienceInput(
            locale: $data['locale'],
            position: $data['position'],
            company: $data['company'],
            summary: $data['summary'] ?? null,
            description: $data['description'],
            startDate: $data['start_date'],
            endDate: $data['end_date'] ?? null,
            display: (bool) ($data['display'] ?? false),
        );
    }

    public static function fromUpdateRequest(
        UpdateExperienceRequest $request,
        Experience $experience,
    ): UpdateExperienceInput {
        $data = $request->validated();

        return new UpdateExperienceInput(
            locale: $data['locale'],
            confirmSwap: (bool) ($data['confirm_swap'] ?? false),
            position: $data['position'],
            company: $data['company'],
            summary: $data['summary'] ?? null,
            description: $data['description'],
            startDate: $data['start_date'],
            endDate: $data['end_date'] ?? null,
            display: (bool) ($data['display'] ?? $experience->display),
        );
    }
}
