<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Repositories;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IProjectRepository
{
    public function paginateAdminList(
        int $perPage,
        ?string $search = null,
        ?ProjectStatus $status = null,
        ?string $visibility = null,
        ?string $sort = null,
        ?string $direction = null,
        ?string $locale = null,
        ?string $fallbackLocale = null,
        int $page = 1,
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
