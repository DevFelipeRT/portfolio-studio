<?php

declare(strict_types=1);

namespace App\Modules\Skills\Domain\Repositories;

use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface ISkillRepository
{
    public function paginateWithCategory(
        int $perPage,
        int $page = 1,
        ?string $search = null,
        ?int $categoryId = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator;

    /**
     * @return EloquentCollection<int,Skill>
     */
    public function allWithCategory(): EloquentCollection;

    /**
     * @return EloquentCollection<int,Skill>
     */
    public function allWithCategoryAndTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): EloquentCollection;

    public function findById(int $id): Skill;

    /**
     * @param array<string,mixed> $attributes
     */
    public function create(array $attributes): Skill;

    /**
     * @param array<string,mixed> $attributes
     */
    public function update(Skill $skill, array $attributes): Skill;

    public function delete(Skill $skill): void;
}
