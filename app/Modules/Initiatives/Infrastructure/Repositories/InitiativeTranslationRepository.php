<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Infrastructure\Repositories;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Models\InitiativeTranslation;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeTranslationRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class InitiativeTranslationRepository implements IInitiativeTranslationRepository
{
    public function listByInitiative(Initiative $initiative): EloquentCollection
    {
        return $initiative->translations()->orderBy('locale')->get();
    }

    public function findByInitiativeAndLocale(
        Initiative $initiative,
        string $locale,
    ): ?InitiativeTranslation {
        return $initiative
            ->translations()
            ->where('locale', $locale)
            ->first();
    }

    public function create(
        Initiative $initiative,
        string $locale,
        array $data,
    ): InitiativeTranslation {
        return $initiative->translations()->create([
            'locale' => $locale,
            'name' => $data['name'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
        ]);
    }

    public function update(
        InitiativeTranslation $translation,
        array $data,
    ): InitiativeTranslation {
        $translation->update([
            'name' => $data['name'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        return $translation;
    }

    public function delete(InitiativeTranslation $translation): void
    {
        $translation->delete();
    }
}
