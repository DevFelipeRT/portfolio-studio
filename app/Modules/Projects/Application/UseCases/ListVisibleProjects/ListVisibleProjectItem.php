<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListVisibleProjects;

final readonly class ListVisibleProjectItem
{
    /**
     * @param array<int, array{
     *     id: int,
     *     url: string,
     *     alt: ?string,
     *     title: ?string,
     *     caption: ?string,
     *     position: ?int,
     *     is_cover: bool,
     *     owner_caption: ?string
     * }> $images
     * @param array<int, array{
     *     id: int,
     *     name: string,
     *     category: ?array{id: int, name: string, slug: string},
     *     skill_category_id: ?int
     * }> $skills
     */
    public function __construct(
        public int $id,
        public string $name,
        public ?string $summary,
        public ?string $description,
        public ?string $repositoryUrl,
        public ?string $liveUrl,
        public bool $display,
        public array $images,
        public array $skills,
    ) {
    }

    /**
     * @return array{
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
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'summary' => $this->summary,
            'description' => $this->description,
            'repository_url' => $this->repositoryUrl,
            'live_url' => $this->liveUrl,
            'display' => $this->display,
            'images' => $this->images,
            'skills' => $this->skills,
        ];
    }
}
