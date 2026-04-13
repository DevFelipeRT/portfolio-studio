<?php

declare(strict_types=1);

namespace App\Modules\Skills\Infrastructure\Queries;

use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class SkillAdminListQuery
{
    public function paginate(
        int $perPage,
        int $page,
        ?string $search,
        ?int $categoryId,
        ?string $sort,
        ?string $direction,
    ): LengthAwarePaginator {
        $builder = Skill::query()->with('category');
        $builder = $this->applySearchFilter($builder, $search);
        $builder = $this->applyCategoryFilter($builder, $categoryId);
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

        $like = '%' . addcslashes(mb_strtolower($trimmed, 'UTF-8'), '\\%_') . '%';

        return $query->where(static function (Builder $nestedQuery) use ($like): void {
            $nestedQuery
                ->whereRaw('LOWER(skills.name) like ?', [$like])
                ->orWhereHas('category', static function (Builder $categoryQuery) use ($like): void {
                    $categoryQuery->whereRaw('LOWER(skill_categories.name) like ?', [$like]);
                });
        });
    }

    private function applyCategoryFilter(Builder $query, ?int $categoryId): Builder
    {
        if ($categoryId === null || $categoryId < 1) {
            return $query;
        }

        return $query->where('skills.skill_category_id', $categoryId);
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        $resolvedDirection = $direction === 'desc' ? 'desc' : 'asc';

        return match ($sort) {
            'name' => $query
                ->orderBy('skills.name', $resolvedDirection)
                ->orderBy('skills.id'),
            'created_at' => $query
                ->orderBy('skills.created_at', $resolvedDirection)
                ->orderBy('skills.id'),
            'updated_at' => $query
                ->orderBy('skills.updated_at', $resolvedDirection)
                ->orderBy('skills.id'),
            'category' => $query
                ->leftJoin('skill_categories', 'skill_categories.id', '=', 'skills.skill_category_id')
                ->select('skills.*')
                ->orderByRaw('CASE WHEN skill_categories.name IS NULL THEN 1 ELSE 0 END')
                ->orderBy('skill_categories.name', $resolvedDirection)
                ->orderBy('skills.name')
                ->orderBy('skills.id'),
            default => $this->applyDefaultSort($query),
        };
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
