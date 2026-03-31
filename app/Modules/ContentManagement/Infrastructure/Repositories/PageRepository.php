<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Infrastructure\Repositories;

use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Repositories\IPageRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Eloquent-backed implementation of the PageRepository contract.
 */
final class PageRepository implements IPageRepository
{
    public function findById(int $id): ?Page
    {
        return Page::query()->find($id);
    }

    public function findBySlugAndLocale(string $slug, string $locale): ?Page
    {
        return Page::query()
            ->where('slug', $slug)
            ->where('locale', $locale)
            ->first();
    }

    public function paginateByStatus(
        ?PageStatus $status,
        ?string $locale = null,
        ?string $search = null,
        int $perPage = 15,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator
    {
        $query = Page::query();

        if ($status !== null) {
            $query = $this->applyStatusFilter($query, $status);
        }

        $query = $this->applyLocaleFilter($query, $locale);
        $query = $this->applySearchFilter($query, $search);

        return $this->applySort($query, $sort, $direction)
            ->paginate($perPage);
    }

    /**
     * @return Collection<int,Page>
     */
    public function all(): Collection
    {
        return Page::query()
            ->orderBy('internal_name')
            ->get();
    }

    /**
     * @return array<int,string>
     */
    public function listLocales(): array
    {
        return Page::query()
            ->select('locale')
            ->distinct()
            ->orderBy('locale')
            ->pluck('locale')
            ->filter()
            ->values()
            ->all();
    }

    public function getSortableAvailability(
        ?PageStatus $status,
        ?string $locale = null,
        ?string $search = null,
    ): array
    {
        [$statusRankExpression, $statusRankBindings] = $this->statusRankSql();
        $sortableColumns = [
            'name',
            'title',
            'slug',
            'locale',
            'status',
            'updated_at',
        ];

        $query = $this->buildFilteredQuery($status, $locale, $search)
            ->toBase()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('MIN(internal_name) as min_internal_name')
            ->selectRaw('MAX(internal_name) as max_internal_name')
            ->selectRaw('MIN(title) as min_title')
            ->selectRaw('MAX(title) as max_title')
            ->selectRaw('MIN(slug) as min_slug')
            ->selectRaw('MAX(slug) as max_slug')
            ->selectRaw('MIN(locale) as min_locale')
            ->selectRaw('MAX(locale) as max_locale')
            ->selectRaw(
                'MIN(' . $statusRankExpression . ') as min_status_rank',
                $statusRankBindings,
            )
            ->selectRaw(
                'MAX(' . $statusRankExpression . ') as max_status_rank',
                $statusRankBindings,
            )
            ->selectRaw('MIN(updated_at) as min_updated_at')
            ->selectRaw('MAX(updated_at) as max_updated_at');

        $aggregates = $query->first();
        $total = isset($aggregates->total) ? (int) $aggregates->total : 0;

        if ($total <= 1) {
            return array_fill_keys($sortableColumns, false);
        }

        return [
            'name' => $aggregates->min_internal_name !== $aggregates->max_internal_name,
            'title' => $aggregates->min_title !== $aggregates->max_title,
            'slug' => $aggregates->min_slug !== $aggregates->max_slug,
            'locale' => $aggregates->min_locale !== $aggregates->max_locale,
            'status' => $aggregates->min_status_rank !== $aggregates->max_status_rank,
            'updated_at' => $aggregates->min_updated_at !== $aggregates->max_updated_at,
        ];
    }

    public function save(Page $page): Page
    {
        $page->save();

        return $page;
    }

    public function delete(Page $page): void
    {
        $page->delete();
    }

    /**
     * Applies a high-level status filter to the underlying query.
     */
    private function applyStatusFilter($query, PageStatus $status)
    {
        return match ($status) {
            PageStatus::Draft => $query
                ->where('is_published', false)
                ->whereNull('published_at'),
            PageStatus::Published => $query->where('is_published', true),
            PageStatus::Archived => $query
                ->where('is_published', false)
                ->whereNotNull('published_at'),
        };
    }

    private function applySearchFilter(Builder $query, ?string $search): Builder
    {
        $trimmed = trim((string) $search);

        if ($trimmed === '') {
            return $query;
        }

        $like = '%' . addcslashes($trimmed, '\\%_') . '%';

        return $query->where(
            static function (Builder $nestedQuery) use ($like): void {
                $nestedQuery
                    ->where('title', 'like', $like)
                    ->orWhere('internal_name', 'like', $like)
                    ->orWhere('slug', 'like', $like);
            }
        );
    }

    private function applyLocaleFilter(Builder $query, ?string $locale): Builder
    {
        $trimmed = trim((string) $locale);

        if ($trimmed === '') {
            return $query;
        }

        return $query->where('locale', $trimmed);
    }

    private function buildFilteredQuery(
        ?PageStatus $status,
        ?string $locale = null,
        ?string $search = null,
    ): Builder {
        $query = Page::query();

        if ($status !== null) {
            $query = $this->applyStatusFilter($query, $status);
        }

        $query = $this->applyLocaleFilter($query, $locale);

        return $this->applySearchFilter($query, $search);
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        [$statusRankExpression, $statusRankBindings] = $this->statusRankSql();
        $sortMap = [
            'name' => 'internal_name',
            'title' => 'title',
            'slug' => 'slug',
            'locale' => 'locale',
            'updated_at' => 'updated_at',
        ];

        $resolvedDirection = $direction === 'desc' ? 'desc' : 'asc';
        $resolvedColumn = $sort !== null ? ($sortMap[$sort] ?? null) : null;

        if ($resolvedColumn === null) {
            return $query
                ->orderBy('internal_name')
                ->orderBy('id');
        }

        if ($sort === 'status') {
            return $query
                ->orderByRaw(
                    $statusRankExpression . ' ' . strtoupper($resolvedDirection),
                    $statusRankBindings,
                )
                ->orderBy('internal_name')
                ->orderBy('id');
        }

        return $query
            ->orderBy($resolvedColumn, $resolvedDirection)
            ->orderBy('id');
    }

    /**
     * @return array{0:string,1:array<int,mixed>}
     */
    private function statusRankSql(): array
    {
        return [
            "CASE
                WHEN is_published = 0 AND published_at IS NULL THEN 1
                WHEN is_published = 1 THEN 2
                ELSE 3
            END",
            [],
        ];
    }
}
