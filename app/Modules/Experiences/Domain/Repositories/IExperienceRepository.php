<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Domain\Repositories;

use App\Modules\Experiences\Domain\Models\Experience;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IExperienceRepository
{
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator;

    /**
     * @return Collection<int,Experience>
     */
    public function allWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection;

    /**
     * @return Collection<int,Experience>
     */
    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection;

    public function findById(int $id): Experience;

    public function create(array $attributes): Experience;

    public function update(Experience $experience, array $attributes): Experience;

    public function delete(Experience $experience): void;
}
