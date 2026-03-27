<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListVisibleProjects;

final readonly class ListVisibleProjectsOutput
{
    /**
     * @param array<int,ListVisibleProjectItem> $items
     */
    public function __construct(
        public array $items,
    ) {
    }

    /**
     * @return array<int,array{
     *     id: int,
     *     name: string,
     *     summary: ?string,
     *     description: ?string,
     *     repository_url: ?string,
     *     live_url: ?string,
     *     display: bool,
     *     images: array<int, array{
     *         id: int,
     *         url: string,
     *         alt: ?string,
     *         title: ?string,
     *         caption: ?string,
     *         position: ?int,
     *         is_cover: bool,
     *         owner_caption: ?string
     *     }>,
     *     skills: array<int, array{
     *         id: int,
     *         name: string,
     *         category: ?array{id: int, name: string, slug: string},
     *         skill_category_id: ?int
     *     }>
     * }>
     */
    public function toArray(): array
    {
        return array_map(
            static fn(ListVisibleProjectItem $item): array => $item->toArray(),
            $this->items,
        );
    }
}
