<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\UpdateInitiative;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use App\Modules\Initiatives\Application\Services\InitiativeImageService;
use Illuminate\Support\Facades\DB;

final class UpdateInitiative
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
        private readonly InitiativeImageService $initiativeImageService,
    ) {
    }

    public function handle(Initiative $initiative, UpdateInitiativeInput $input): Initiative
    {
        return DB::transaction(function () use ($initiative, $input): Initiative {
            $this->initiatives->update($initiative, [
                'locale' => $input->locale,
                'name' => $input->name,
                'summary' => $input->summary,
                'description' => $input->description,
                'display' => $input->display,
                'start_date' => $input->startDate,
                'end_date' => $input->endDate,
            ]);

            if ($input->images !== null) {
                $this->initiativeImageService->replace($initiative, $input->images);
            }

            return $initiative->load(['images']);
        });
    }
}
