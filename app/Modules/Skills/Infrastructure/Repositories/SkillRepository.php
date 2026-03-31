<?php

declare(strict_types=1);

namespace App\Modules\Skills\Infrastructure\Repositories;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Infrastructure\Queries\SkillAdminListQuery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class SkillRepository implements ISkillRepository
{
    public function __construct(
        private readonly SkillAdminListQuery $skillAdminListQuery,
    ) {
    }

    public function paginateWithCategory(
        int $perPage,
        int $page = 1,
        ?string $search = null,
        ?int $categoryId = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator
    {
        return $this->skillAdminListQuery->paginate(
            perPage: $perPage,
            page: $page,
            search: $search,
            categoryId: $categoryId,
            sort: $sort,
            direction: $direction,
        );
    }

    public function allWithCategory(): EloquentCollection
    {
        return $this->applyDefaultSort(
            Skill::query()->with('category'),
        )
            ->get();
    }

    public function allWithCategoryAndTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): EloquentCollection {
        $locales = $this->normalizeLocales($locale, $fallbackLocale);

        $query = Skill::query()
            ->with('category');

        if ($locales !== []) {
            $query->with([
                'translations' => static fn($relation) => $relation->whereIn('locale', $locales),
                'category.translations' => static fn($relation) => $relation->whereIn('locale', $locales),
            ]);
        }

        return $this->applyDefaultSort($query)->get();
    }

    public function findById(int $id): Skill
    {
        return Skill::query()->findOrFail($id);
    }

    public function create(array $attributes): Skill
    {
        return Skill::query()->create($attributes);
    }

    public function update(Skill $skill, array $attributes): Skill
    {
        $skill->update($attributes);

        return $skill;
    }

    public function delete(Skill $skill): void
    {
        $skill->delete();
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

    private function applyDefaultSort(Builder $query): Builder
    {
        return $query
            ->leftJoin('skill_categories', 'skill_categories.id', '=', 'skills.skill_category_id')
            ->select('skills.*')
            ->orderByRaw('CASE WHEN skill_categories.name IS NULL THEN 1 ELSE 0 END')
            ->orderBy('skill_categories.name')
            ->orderBy('skills.name')
            ->orderBy('skills.id');
    }
}
