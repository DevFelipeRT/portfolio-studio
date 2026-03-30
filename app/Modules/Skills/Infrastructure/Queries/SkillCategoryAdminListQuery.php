<?php

declare(strict_types=1);

namespace App\Modules\Skills\Infrastructure\Queries;

use App\Modules\Skills\Domain\Models\SkillCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class SkillCategoryAdminListQuery
{
    public function paginate(
        int $perPage,
        int $page,
        ?string $search,
        ?string $sort,
        ?string $direction,
    ): LengthAwarePaginator {
        $builder = SkillCategory::query();
        $builder = $this->applySearchFilter($builder, $search);
        $builder = $this->applySort($builder, $sort, $direction);

        return $builder
            ->paginate($perPage, ['*'], 'page', max($page, 1))
            ->withQueryString();
    }

    private function applySearchFilter(Builder $query, ?string $search): Builder
    {
        $trimmed = trim((string) $search);

        if ($trimmed === '') {
            return $query;
        }

        $like = '%' . addcslashes($trimmed, '\\%_') . '%';

        return $query->where(static function (Builder $nestedQuery) use ($like): void {
            $nestedQuery
                ->where('skill_categories.name', 'like', $like)
                ->orWhere('skill_categories.slug', 'like', $like);
        });
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        $resolvedDirection = $direction === 'desc' ? 'desc' : 'asc';

        return match ($sort) {
            'slug' => $query
                ->orderBy('skill_categories.slug', $resolvedDirection)
                ->orderBy('skill_categories.id'),
            'updated_at' => $query
                ->orderBy('skill_categories.updated_at', $resolvedDirection)
                ->orderBy('skill_categories.id'),
            'name' => $query
                ->orderBy('skill_categories.name', $resolvedDirection)
                ->orderBy('skill_categories.id'),
            default => $query
                ->orderBy('skill_categories.name')
                ->orderBy('skill_categories.id'),
        };
    }
}
