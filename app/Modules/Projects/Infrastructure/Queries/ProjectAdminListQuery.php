<?php

declare(strict_types=1);

namespace App\Modules\Projects\Infrastructure\Queries;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ProjectAdminListQuery
{
    public function paginate(
        int $perPage,
        int $page,
        ?string $search,
        ?ProjectStatus $status,
        ?string $visibility,
        ?string $sort,
        ?string $direction,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator {
        $builder = $this->withTranslations(
            Project::query()->withCount('images'),
            $locale,
            $fallbackLocale,
        );

        $builder = $this->applySearch($builder, $search, $locale, $fallbackLocale);
        $builder = $this->applyStatusFilter($builder, $status, $locale, $fallbackLocale);
        $builder = $this->applyVisibilityFilter($builder, $visibility);
        $builder = $this->applySort($builder, $sort, $direction, $locale, $fallbackLocale);

        return $builder
            ->paginate($perPage, ['*'], 'page', max($page, 1))
            ->withQueryString();
    }

    private function withTranslations(
        Builder $query,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Builder {
        $locales = $this->normalizeLocales($locale, $fallbackLocale);

        if ($locales !== []) {
            $query->with([
                'translations' => static fn($relation) => $relation->whereIn('locale', $locales),
            ]);
        }

        return $query;
    }

    private function applySearch(
        Builder $query,
        ?string $search,
        ?string $locale,
        ?string $fallbackLocale,
    ): Builder {
        $term = $this->normalizeSearchTerm($search);

        if ($term === null) {
            return $query;
        }

        $like = $this->toLikePattern($term);

        return $query->where(function (Builder $nestedQuery) use (
            $like,
            $locale,
            $fallbackLocale,
        ): void {
            $nestedQuery
                ->whereRaw(
                    'LOWER(' . $this->resolvedTranslationFieldExpression('name', $locale, $fallbackLocale) . ') like ?',
                    [
                        ...$this->resolvedTranslationFieldBindings($locale, $fallbackLocale),
                        $like,
                    ],
                )
                ->orWhereRaw(
                    'LOWER(' . $this->resolvedTranslationFieldExpression('summary', $locale, $fallbackLocale) . ') like ?',
                    [
                        ...$this->resolvedTranslationFieldBindings($locale, $fallbackLocale),
                        $like,
                    ],
                );
        });
    }

    private function applyStatusFilter(
        Builder $query,
        ?ProjectStatus $status,
        ?string $locale,
        ?string $fallbackLocale,
    ): Builder {
        if ($status === null) {
            return $query;
        }

        $matches = $status->equivalentScalars();
        $placeholders = implode(', ', array_fill(0, count($matches), '?'));

        return $query->whereRaw(
            "projects.status in ({$placeholders})",
            $matches,
        );
    }

    private function applyVisibilityFilter(Builder $query, ?string $visibility): Builder
    {
        return match ($visibility) {
            'public' => $query->where('projects.display', true),
            'private' => $query->where('projects.display', false),
            default => $query,
        };
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
        ?string $locale,
        ?string $fallbackLocale,
    ): Builder {
        $resolvedDirection = $direction === 'asc' ? 'asc' : 'desc';

        return match ($sort) {
            'name' => $query
                ->orderByRaw(
                    $this->resolvedTranslationFieldExpression('name', $locale, $fallbackLocale) . ' ' . $resolvedDirection,
                    $this->resolvedTranslationFieldBindings($locale, $fallbackLocale),
                )
                ->orderBy('projects.id'),
            'status' => $query
                ->orderBy('projects.status', $resolvedDirection)
                ->orderByDesc('projects.created_at')
                ->orderByDesc('projects.id'),
            'display' => $query
                ->orderBy('projects.display', $resolvedDirection)
                ->orderByDesc('projects.created_at')
                ->orderByDesc('projects.id'),
            'image_count' => $query
                ->orderBy('images_count', $resolvedDirection)
                ->orderByDesc('projects.created_at')
                ->orderByDesc('projects.id'),
            default => $query
                ->orderByDesc('projects.created_at')
                ->orderByDesc('projects.id'),
        };
    }

    private function resolvedTranslationFieldExpression(
        string $field,
        ?string $locale,
        ?string $fallbackLocale,
    ): string {
        $resolvedLocale = $this->normalizeLocale($locale);
        $resolvedFallbackLocale = $this->normalizeLocale($fallbackLocale);
        $column = match ($field) {
            'name', 'summary' => 'projects.' . $field,
            default => throw new \InvalidArgumentException('Unsupported translated field.'),
        };

        if ($resolvedLocale === null) {
            return $column;
        }

        $parts = [
            sprintf(
                '(select locale_translation.%1$s from project_translations as locale_translation'
                . ' where locale_translation.project_id = projects.id'
                . ' and locale_translation.locale = ?'
                . ' and locale_translation.%1$s is not null'
                . " and trim(locale_translation.%1\$s) <> ''"
                . ' limit 1)',
                $field,
            ),
        ];

        if (
            $resolvedFallbackLocale !== null
            && $resolvedFallbackLocale !== $resolvedLocale
        ) {
            $parts[] = sprintf(
                '(select fallback_translation.%1$s from project_translations as fallback_translation'
                . ' where fallback_translation.project_id = projects.id'
                . ' and fallback_translation.locale = ?'
                . ' and fallback_translation.%1$s is not null'
                . " and trim(fallback_translation.%1\$s) <> ''"
                . ' limit 1)',
                $field,
            );
        }

        $parts[] = $column;

        return sprintf(
            'case when projects.locale = ? then %s else coalesce(%s) end',
            $column,
            implode(', ', $parts),
        );
    }

    /**
     * @return array<int,string>
     */
    private function resolvedTranslationFieldBindings(
        ?string $locale,
        ?string $fallbackLocale,
    ): array {
        $resolvedLocale = $this->normalizeLocale($locale);
        $resolvedFallbackLocale = $this->normalizeLocale($fallbackLocale);

        if ($resolvedLocale === null) {
            return [];
        }

        $bindings = [$resolvedLocale];

        if (
            $resolvedFallbackLocale !== null
            && $resolvedFallbackLocale !== $resolvedLocale
        ) {
            $bindings[] = $resolvedFallbackLocale;
        }

        $bindings[] = $resolvedLocale;

        return $bindings;
    }

    /**
     * @return array<int,string>
     */
    private function normalizeLocales(?string $locale, ?string $fallbackLocale): array
    {
        $values = array_filter([
            $this->normalizeLocale($locale),
            $this->normalizeLocale($fallbackLocale),
        ]);

        return array_values(array_unique($values));
    }

    private function normalizeLocale(?string $locale): ?string
    {
        if ($locale === null) {
            return null;
        }

        $trimmed = trim($locale);

        return $trimmed === '' ? null : $trimmed;
    }

    private function normalizeSearchTerm(?string $value): ?string
    {
        $term = trim((string) $value);

        return $term === '' ? null : $term;
    }

    private function toLikePattern(string $value): string
    {
        return '%' . addcslashes(mb_strtolower($value, 'UTF-8'), '\\%_') . '%';
    }
}
