<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Mappers;

use App\Modules\Initiatives\Application\UseCases\CreateInitiative\CreateInitiativeInput;
use App\Modules\Initiatives\Application\UseCases\UpdateInitiative\UpdateInitiativeInput;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Http\Requests\Initiative\StoreInitiativeRequest;
use App\Modules\Initiatives\Http\Requests\Initiative\UpdateInitiativeRequest;

final class InitiativeInputMapper
{
    public static function fromStoreRequest(StoreInitiativeRequest $request): CreateInitiativeInput
    {
        $data = $request->validated();

        return new CreateInitiativeInput(
            locale: $data['locale'],
            name: $data['name'],
            summary: $data['summary'],
            description: $data['description'],
            display: (bool) ($data['display'] ?? false),
            startDate: $data['start_date'],
            endDate: $data['end_date'] ?? null,
            images: $data['images'] ?? [],
        );
    }

    public static function fromUpdateRequest(
        UpdateInitiativeRequest $request,
        Initiative $initiative,
    ): UpdateInitiativeInput {
        $data = $request->validated();

        return new UpdateInitiativeInput(
            locale: $data['locale'],
            confirmSwap: (bool) ($data['confirm_swap'] ?? false),
            name: $data['name'],
            summary: $data['summary'],
            description: $data['description'],
            display: (bool) ($data['display'] ?? $initiative->display),
            startDate: $data['start_date'],
            endDate: $data['end_date'] ?? null,
            images: $request->has('images') ? ($data['images'] ?? []) : null,
        );
    }
}
