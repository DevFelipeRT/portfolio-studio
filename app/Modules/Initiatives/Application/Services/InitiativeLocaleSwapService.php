<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Services;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeTranslationRepository;
use Illuminate\Support\Facades\DB;

final class InitiativeLocaleSwapService
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
        private readonly IInitiativeTranslationRepository $translations,
    ) {
    }

    public function swap(Initiative $initiative, string $newLocale): Initiative
    {
        return DB::transaction(function () use ($initiative, $newLocale): Initiative {
            $translation = $this->translations->findByInitiativeAndLocale(
                $initiative,
                $newLocale,
            );

            if ($translation === null) {
                return $initiative;
            }

            $oldLocale = $initiative->locale;

            $basePayload = [
                'name' => $initiative->name,
                'summary' => $initiative->summary,
                'description' => $initiative->description,
            ];

            $newBasePayload = [
                'name' => $translation->name,
                'summary' => $translation->summary,
                'description' => $translation->description,
            ];

            $this->initiatives->update($initiative, [
                'locale' => $newLocale,
                'name' => $newBasePayload['name'],
                'summary' => $newBasePayload['summary'],
                'description' => $newBasePayload['description'],
            ]);

            $existingOldTranslation = $this->translations->findByInitiativeAndLocale(
                $initiative,
                $oldLocale,
            );

            if ($existingOldTranslation !== null) {
                $this->translations->update($existingOldTranslation, $basePayload);
            } else {
                $this->translations->create($initiative, $oldLocale, $basePayload);
            }

            $this->translations->delete($translation);

            return $initiative->refresh();
        });
    }
}
