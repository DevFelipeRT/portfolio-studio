<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Domain\Repositories;

use App\Modules\Initiatives\Domain\Models\Initiative;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IInitiativeRepository
{
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
        int $page = 1,
        ?string $search = null,
        ?string $displayFilter = null,
        ?string $hasImages = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator;

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

    public function countVisible(
        ?string $locale = null,
        ?string $fallbackLocale = null,
        ?string $search = null,
        ?string $displayFilter = null,
        ?string $hasImages = null,
    ): int;

    public function findById(int $id): Initiative;

    public function create(array $attributes): Initiative;

    public function update(Initiative $initiative, array $attributes): Initiative;

    public function delete(Initiative $initiative): void;
}
