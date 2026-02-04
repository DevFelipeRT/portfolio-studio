<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Domain\Repositories;

use App\Modules\Initiatives\Domain\Models\Initiative;
use Illuminate\Database\Eloquent\Collection;

interface IInitiativeRepository
{
    /**
     * @return Collection<int,Initiative>
     */
    public function allWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection;

    /**
     * @return Collection<int,Initiative>
     */
    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection;

    public function findById(int $id): Initiative;

    public function create(array $attributes): Initiative;

    public function update(Initiative $initiative, array $attributes): Initiative;

    public function delete(Initiative $initiative): void;
}
