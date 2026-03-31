<?php

declare(strict_types=1);

namespace App\Modules\Shared\Abstractions\Http;

use App\Modules\Shared\Abstractions\Mapping\Mapper;

abstract class Controller
{
    /**
     * Transform a length-aware paginated collection using a callable mapper.
     *
     * @template TItem of mixed
     * @param \Illuminate\Pagination\LengthAwarePaginator $paginator
     * @param callable(TItem): array<string,mixed> $mapper
     * @return array{
     *     data: array<int, array<string,mixed>>,
     *     current_page: int,
     *     last_page: int,
     *     per_page: int,
     *     from: int|null,
     *     to: int|null,
     *     total: int,
     *     path: string,
     *     links: array<int, array{url:string|null,label:string,active:bool}>
     * }
     */
    protected function mapPaginatedItems($paginator, callable $mapper): array
    {
        $items = array_map($mapper, $paginator->items());

        return [
            'data' => $items,
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
            'total' => $paginator->total(),
            'path' => $paginator->path(),
            'links' => $paginator->linkCollection()
                ->map(static fn(array $link): array => [
                    'url' => $link['url'],
                    'label' => (string) $link['label'],
                    'active' => (bool) $link['active'],
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * Transform a length-aware paginated collection using a mapper.
     *
     * @template T of object
     * @param \Illuminate\Pagination\LengthAwarePaginator $paginator
     * @param class-string<Mapper> $mapper
     * @return array{
     *     data: array<int, array<string,mixed>>,
     *     current_page: int,
     *     last_page: int,
     *     per_page: int,
     *     from: int|null,
     *     to: int|null,
     *     total: int,
     *     path: string,
     *     links: array<int, array{url:string|null,label:string,active:bool}>
     * }
     */
    protected function mapPaginatedResource($paginator, string $mapper): array
    {
        return $this->mapPaginatedItems(
            $paginator,
            static fn($item): array => $mapper::toArray($item),
        );
    }

    /**
     * Resolve a sortable column against a controller-provided whitelist.
     *
     * @param array<int,string> $sortableColumns
     */
    protected function resolveTableSort(
        mixed $rawSort,
        array $sortableColumns,
    ): ?string {
        if (!is_string($rawSort)) {
            return null;
        }

        $sort = trim($rawSort);

        return in_array($sort, $sortableColumns, true) ? $sort : null;
    }

    /**
     * Resolve sort direction for an active sortable column while preserving
     * each controller's existing default direction fallback.
     */
    protected function resolveTableDirection(
        mixed $rawDirection,
        ?string $sort,
        string $defaultDirection = 'desc',
    ): ?string {
        if ($sort === null) {
            return null;
        }

        if (!is_string($rawDirection)) {
            return $defaultDirection;
        }

        return $rawDirection === 'asc'
            ? 'asc'
            : ($rawDirection === 'desc' ? 'desc' : $defaultDirection);
    }
}
