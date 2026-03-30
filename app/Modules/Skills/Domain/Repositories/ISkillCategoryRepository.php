<?php

declare(strict_types=1);

namespace App\Modules\Skills\Domain\Repositories;

use App\Modules\Skills\Domain\Models\SkillCategory;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ISkillCategoryRepository
{
    /**
     * @return EloquentCollection<int,SkillCategory>
     */
    public function allOrdered(): EloquentCollection;

    /**
     * @return EloquentCollection<int,SkillCategory>
     */
    public function allOrderedWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): EloquentCollection;

    public function paginateOrdered(
        int $perPage,
        int $page = 1,
        ?string $search = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator;

    public function findById(int $id): SkillCategory;

    /**
     * @param array<string,mixed> $attributes
     */
    public function create(array $attributes): SkillCategory;

    /**
     * @param array<string,mixed> $attributes
     */
    public function update(SkillCategory $category, array $attributes): SkillCategory;

    public function delete(SkillCategory $category): void;
}
