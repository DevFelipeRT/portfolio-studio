<?php

declare(strict_types=1);

namespace App\Modules\Skills\Infrastructure\Repositories;

use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Infrastructure\Queries\SkillCategoryAdminListQuery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class SkillCategoryRepository implements ISkillCategoryRepository
{
    public function __construct(
        private readonly SkillCategoryAdminListQuery $skillCategoryAdminListQuery,
    ) {
    }

    public function allOrdered(): EloquentCollection
    {
        return SkillCategory::query()
            ->orderBy('name')
            ->get();
    }

    public function allOrderedWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): EloquentCollection {
        $locales = $this->normalizeLocales($locale, $fallbackLocale);

        $query = SkillCategory::query();

        if ($locales !== []) {
            $query->with([
                'translations' => static fn($relation) => $relation->whereIn('locale', $locales),
            ]);
        }

        return $query
            ->orderBy('name')
            ->get();
    }

    public function paginateOrdered(
        int $perPage,
        int $page = 1,
        ?string $search = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator
    {
        return $this->skillCategoryAdminListQuery->paginate(
            perPage: $perPage,
            page: $page,
            search: $search,
            sort: $sort,
            direction: $direction,
        );
    }

    public function findById(int $id): SkillCategory
    {
        return SkillCategory::query()->findOrFail($id);
    }

    public function create(array $attributes): SkillCategory
    {
        return SkillCategory::query()->create($attributes);
    }

    public function update(SkillCategory $category, array $attributes): SkillCategory
    {
        $category->update($attributes);

        return $category;
    }

    public function delete(SkillCategory $category): void
    {
        $category->delete();
    }

    /**
     * @return array<int,string>
     */
    private function normalizeLocales(?string $locale, ?string $fallbackLocale): array
    {
        $values = array_filter([
            $locale !== null ? trim($locale) : null,
            $fallbackLocale !== null ? trim($fallbackLocale) : null,
        ]);

        return array_values(array_unique($values));
    }

}
