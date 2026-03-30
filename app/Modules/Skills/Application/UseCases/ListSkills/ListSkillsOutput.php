<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkills;

final readonly class ListSkillsOutput
{
    /**
     * @param array<int,ListSkillItem> $items
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
     *         name:string,
     *         locale:string,
     *         skill_category_id:?int,
     *         category:array{id:int,name:string}|null,
     *         created_at:?string,
     *         updated_at:?string
     *     }>,
     *     current_page:int,
     *     last_page:int,
     *     per_page:int,
     *     from:?int,
     *     to:?int,
     *     total:int,
     *     path:string,
     *     links:array<int,array{url:string|null,label:string,active:bool}>
     * }
     */
    public function toArray(): array
    {
        return [
            'data' => array_map(
                static fn(ListSkillItem $item): array => $item->toArray(),
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
