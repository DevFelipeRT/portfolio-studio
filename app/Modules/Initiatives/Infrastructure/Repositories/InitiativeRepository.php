<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Infrastructure\Repositories;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class InitiativeRepository implements IInitiativeRepository
{
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
        int $page = 1,
        ?string $search = null,
        ?string $displayFilter = null,
        ?string $hasImages = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator {
        return $this->applySort(
            $this->filteredQuery(
                $locale,
                $fallbackLocale,
                $search,
                $displayFilter,
                $hasImages,
            ),
            $sort,
            $direction,
        )
            ->paginate($perPage, ['*'], 'page', max($page, 1))
            ->withQueryString();
    }

    public function allWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            $this->baseQuery(),
            $locale,
            $fallbackLocale,
        )
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }

    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            $this->baseQuery(),
            $locale,
            $fallbackLocale,
        )
            ->where('display', true)
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }

    public function countVisible(
        ?string $locale = null,
        ?string $fallbackLocale = null,
        ?string $search = null,
        ?string $displayFilter = null,
        ?string $hasImages = null,
    ): int
    {
        return $this->applyHasImagesFilter(
            $this->applyDisplayFilter(
                $this->applySearchFilter(
                    Initiative::query(),
                    $search,
                    $locale,
                    $fallbackLocale,
                ),
                $displayFilter,
            ),
            $hasImages,
        )
            ->where('display', true)
            ->count();
    }

    public function findById(int $id): Initiative
    {
        return Initiative::query()->findOrFail($id);
    }

    public function create(array $attributes): Initiative
    {
        return Initiative::query()->create($attributes);
    }

    public function update(Initiative $initiative, array $attributes): Initiative
    {
        $initiative->update($attributes);

        return $initiative;
    }

    public function delete(Initiative $initiative): void
    {
        $initiative->delete();
    }

    private function baseQuery(): Builder
    {
        return Initiative::query()
            ->withCount('images');
    }

    private function filteredQuery(
        ?string $locale,
        ?string $fallbackLocale,
        ?string $search,
        ?string $displayFilter,
        ?string $hasImages,
    ): Builder {
        return $this->applyHasImagesFilter(
            $this->applyDisplayFilter(
                $this->applySearchFilter(
                    $this->withTranslations(
                        $this->baseQuery(),
                        $locale,
                        $fallbackLocale,
                    ),
                    $search,
                    $locale,
                    $fallbackLocale,
                ),
                $displayFilter,
            ),
            $hasImages,
        );
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

    private function applySearchFilter(
        Builder $query,
        ?string $search,
        ?string $locale,
        ?string $fallbackLocale,
    ): Builder
    {
        $trimmed = trim((string) $search);

        if ($trimmed === '') {
            return $query;
        }

        $like = '%' . addcslashes(mb_strtolower($trimmed, 'UTF-8'), '\\%_') . '%';

        return $query->where(function (Builder $nestedQuery) use (
            $like,
            $locale,
            $fallbackLocale,
        ): void {
            $nestedQuery
                ->whereRaw(
                    'LOWER(' . $this->resolvedTranslationFieldExpression(
                        'name',
                        $locale,
                        $fallbackLocale,
                    ) . ') like ?',
                    [
                        ...$this->resolvedTranslationFieldBindings(
                            $locale,
                            $fallbackLocale,
                        ),
                        $like,
                    ],
                )
                ->orWhereRaw(
                    'LOWER(' . $this->resolvedTranslationFieldExpression(
                        'summary',
                        $locale,
                        $fallbackLocale,
                    ) . ') like ?',
                    [
                        ...$this->resolvedTranslationFieldBindings(
                            $locale,
                            $fallbackLocale,
                        ),
                        $like,
                    ],
                );
        });
    }

    private function resolvedTranslationFieldExpression(
        string $field,
        ?string $locale,
        ?string $fallbackLocale,
    ): string {
        $resolvedLocale = $this->normalizeLocale($locale);
        $resolvedFallbackLocale = $this->normalizeLocale($fallbackLocale);
        $column = match ($field) {
            'name', 'summary' => 'initiatives.' . $field,
            default => throw new \InvalidArgumentException('Unsupported translated field.'),
        };

        if ($resolvedLocale === null) {
            return $column;
        }

        $parts = [
            sprintf(
                '(select locale_translation.%1$s from initiative_translations as locale_translation'
                . ' where locale_translation.initiative_id = initiatives.id'
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
                '(select fallback_translation.%1$s from initiative_translations as fallback_translation'
                . ' where fallback_translation.initiative_id = initiatives.id'
                . ' and fallback_translation.locale = ?'
                . ' and fallback_translation.%1$s is not null'
                . " and trim(fallback_translation.%1\$s) <> ''"
                . ' limit 1)',
                $field,
            );
        }

        $parts[] = $column;

        return sprintf(
            'case when initiatives.locale = ? then %s else coalesce(%s) end',
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

        $bindings = [$resolvedLocale, $resolvedLocale];

        if (
            $resolvedFallbackLocale !== null
            && $resolvedFallbackLocale !== $resolvedLocale
        ) {
            $bindings[] = $resolvedFallbackLocale;
        }

        return $bindings;
    }

    private function applyDisplayFilter(
        Builder $query,
        ?string $displayFilter,
    ): Builder {
        return match ($displayFilter) {
            'visible' => $query->where('initiatives.display', true),
            'hidden' => $query->where('initiatives.display', false),
            default => $query,
        };
    }

    private function applyHasImagesFilter(
        Builder $query,
        ?string $hasImages,
    ): Builder {
        return match ($hasImages) {
            'with' => $query->whereHas('images'),
            'without' => $query->whereDoesntHave('images'),
            default => $query,
        };
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        $resolvedDirection = $direction === 'asc' ? 'asc' : 'desc';

        return match ($sort) {
            'name' => $query
                ->orderBy('initiatives.name', $resolvedDirection)
                ->orderByDesc('initiatives.start_date')
                ->orderByDesc('initiatives.id'),
            'start_date' => $query
                ->orderBy('initiatives.start_date', $resolvedDirection)
                ->orderByDesc('initiatives.id'),
            'display' => $query
                ->orderBy('initiatives.display', $resolvedDirection)
                ->orderByDesc('initiatives.start_date')
                ->orderByDesc('initiatives.id'),
            'image_count' => $query
                ->orderBy('images_count', $resolvedDirection)
                ->orderByDesc('initiatives.start_date')
                ->orderByDesc('initiatives.id'),
            default => $query
                ->orderByDesc('initiatives.start_date')
                ->orderByDesc('initiatives.id'),
        };
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
}
