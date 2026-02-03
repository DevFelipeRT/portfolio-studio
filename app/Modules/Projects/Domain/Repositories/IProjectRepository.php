<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Repositories;

use App\Modules\Projects\Domain\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IProjectRepository
{
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator;

    /**
     * @return Collection<int,Project>
     */
    public function allWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection;

    /**
     * @return Collection<int,Project>
     */
    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection;

    public function findById(int $id): Project;

    public function create(array $attributes): Project;

    public function update(Project $project, array $attributes): Project;

    public function delete(Project $project): void;
}
