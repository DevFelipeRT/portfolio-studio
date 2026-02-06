<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\UpdateInitiative;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use App\Modules\Initiatives\Application\Services\InitiativeImageService;
use App\Modules\Initiatives\Application\Services\InitiativeLocaleSwapService;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeTranslationRepository;
use Illuminate\Support\Facades\DB;

final class UpdateInitiative
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
        private readonly InitiativeImageService $initiativeImageService,
        private readonly IInitiativeTranslationRepository $translations,
        private readonly InitiativeLocaleSwapService $localeSwapService,
    ) {
    }

    public function handle(Initiative $initiative, UpdateInitiativeInput $input): Initiative
    {
        return DB::transaction(function () use ($initiative, $input): Initiative {
            $localeChanged = $input->locale !== $initiative->locale;
            $shouldSwap = false;

            if ($localeChanged) {
                $existing = $this->translations->findByInitiativeAndLocale(
                    $initiative,
                    $input->locale,
                );
                $shouldSwap = $existing !== null && $input->confirmSwap;
            }

            if ($shouldSwap) {
                $initiative = $this->localeSwapService->swap($initiative, $input->locale);
            } else {
                $this->initiatives->update($initiative, [
                    'locale' => $input->locale,
                    'name' => $input->name,
                    'summary' => $input->summary,
                    'description' => $input->description,
                ]);
            }

            $this->initiatives->update($initiative, [
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
