<?php

declare(strict_types=1);

namespace App\Modules\Shared\Abstractions\Http;

use App\Modules\Shared\Abstractions\Mapping\Mapper;

abstract class Controller
{
    /**
     * Transform a paginated collection using a mapper.
     *
     * @template T of object
     * @param \Illuminate\Contracts\Pagination\Paginator|\Illuminate\Pagination\LengthAwarePaginator $paginator
     * @param class-string<Mapper> $mapper
     * @return array{
     *     data: array<int, array<string,mixed>>,
     *     pagination: array{current_page:int,last_page:int,per_page:int,total:int}
     * }
     */
    protected function mapPaginatedResource($paginator, string $mapper): array
    {
        $items = $paginator->items();

        return [
            'data' => $mapper::collection($items),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }
}
