<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\CreateInitiative;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use App\Modules\Initiatives\Application\Services\InitiativeImageService;
use App\Modules\Shared\Contracts\RichText\IRichTextService;
use Illuminate\Support\Facades\DB;

final class CreateInitiative
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
        private readonly InitiativeImageService $initiativeImageService,
        private readonly IRichTextService $richText,
    ) {
    }

    public function handle(CreateInitiativeInput $input): Initiative
    {
        return DB::transaction(function () use ($input): Initiative {
            $preparedDescription = $this->richText->prepareForPersistence($input->description, 'description');

            $initiative = $this->initiatives->create([
                'locale' => $input->locale,
                'name' => $input->name,
                'summary' => $input->summary,
                'description' => $preparedDescription->normalized(),
                'display' => $input->display,
                'start_date' => $input->startDate,
                'end_date' => $input->endDate,
            ]);

            if ($input->images !== []) {
                $this->initiativeImageService->replace($initiative, $input->images);
            }

            return $initiative->load(['images']);
        });
    }
}
