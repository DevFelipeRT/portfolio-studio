<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjects;

final readonly class ListProjectsOutput
{
    /**
     * @param array<int,ListProjectItem> $items
     * @param array<int,array{url:string|null,label:string,active:bool}> $links
     */
    public function __construct(
        public array $items,
        public int $currentPage,
        public int $lastPage,
        public int $perPage,
        public ?int $from,
        public ?int $to,
        public int $total,
        public string $path,
        public array $links,
    ) {
    }

    public function shouldClampPage(): bool
    {
        return $this->currentPage > $this->lastPage;
    }

    /**
     * @return array{
     *     data: array<int, array{
     *         id:int,
     *         locale:string,
     *         name:string,
     *         summary:?string,
     *         status:?string,
     *         display:bool,
     *         skills:array<int,array{id:int,name:string}>
     *     }>,
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
    public function toArray(): array
    {
        return [
            'data' => array_map(
                static fn(ListProjectItem $item): array => $item->toArray(),
                $this->items,
            ),
            'current_page' => $this->currentPage,
            'last_page' => $this->lastPage,
            'per_page' => $this->perPage,
            'from' => $this->from,
            'to' => $this->to,
            'total' => $this->total,
            'path' => $this->path,
            'links' => $this->links,
        ];
    }
}
