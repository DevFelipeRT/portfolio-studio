<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Domain\Repositories;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Models\InitiativeTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface IInitiativeTranslationRepository
{
    /**
     * @return EloquentCollection<int,InitiativeTranslation>
     */
    public function listByInitiative(Initiative $initiative): EloquentCollection;

    public function findByInitiativeAndLocale(
        Initiative $initiative,
        string $locale,
    ): ?InitiativeTranslation;

    public function create(
        Initiative $initiative,
        string $locale,
        array $data,
    ): InitiativeTranslation;

    public function update(
        InitiativeTranslation $translation,
        array $data,
    ): InitiativeTranslation;

    public function delete(InitiativeTranslation $translation): void;
}
