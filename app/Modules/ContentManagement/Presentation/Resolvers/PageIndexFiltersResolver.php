<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Resolvers;

use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use ValueError;

/**
 * Resolves raw admin index filters into a normalized page-list filter state.
 */
final class PageIndexFiltersResolver
{
    /**
     * @var list<string>
     */
    private const ALLOWED_SORTS = [
        'name',
        'title',
        'slug',
        'locale',
        'status',
        'updated_at',
    ];

    /**
     * @param array<string,mixed> $filters
     */
    public function resolve(array $filters): ResolvedPageIndexFilters
    {
        $sort = $this->resolveSort($filters['sort'] ?? null);

        return new ResolvedPageIndexFilters(
            status: $this->resolveStatus($filters['status'] ?? null),
            locale: $this->resolveLocale($filters['locale'] ?? null),
            search: $this->resolveSearch($filters['search'] ?? null),
            sort: $sort,
            direction: $this->resolveDirection($filters['direction'] ?? null, $sort),
        );
    }

    private function resolveStatus(mixed $rawStatus): ?PageStatus
    {
        if (! is_string($rawStatus) || trim($rawStatus) === '') {
            return null;
        }

        try {
            return PageStatus::from(trim($rawStatus));
        } catch (ValueError) {
            return null;
        }
    }

    private function resolveSearch(mixed $rawSearch): ?string
    {
        if (! is_string($rawSearch)) {
            return null;
        }

        $trimmed = trim($rawSearch);

        return $trimmed === '' ? null : $trimmed;
    }

    private function resolveLocale(mixed $rawLocale): ?string
    {
        if (! is_string($rawLocale)) {
            return null;
        }

        $trimmed = trim($rawLocale);

        if ($trimmed === '' || $trimmed === 'all') {
            return null;
        }

        return $trimmed;
    }

    private function resolveSort(mixed $rawSort): string
    {
        if (! is_string($rawSort)) {
            return 'name';
        }

        $trimmed = trim($rawSort);

        if ($trimmed === '') {
            return 'name';
        }

        if (! in_array($trimmed, self::ALLOWED_SORTS, true)) {
            return 'name';
        }

        return $trimmed;
    }

    private function resolveDirection(mixed $rawDirection, string $sort): string
    {
        if ($sort === '') {
            return 'asc';
        }

        return $rawDirection === 'desc' ? 'desc' : 'asc';
    }
}
