<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\GetProjectDetails;

final readonly class GetProjectDetailsOutput
{
    /**
     * @param array<int,array{
     *     id:int,
     *     url:?string,
     *     alt:?string,
     *     title:?string,
     *     caption:?string,
     *     position:?int,
     *     is_cover:bool,
     *     owner_caption:?string
     * }> $images
     * @param array<int,array{id:int,name:string}> $skills
     */
    public function __construct(
        public int $id,
        public string $locale,
        public string $name,
        public ?string $summary,
        public ?string $description,
        public ?string $status,
        public ?string $repositoryUrl,
        public ?string $liveUrl,
        public bool $display,
        public ?string $createdAt,
        public ?string $updatedAt,
        public array $images,
        public array $skills,
    ) {
    }

    /**
     * @return array{
     *     id:int,
     *     locale:string,
     *     name:string,
     *     summary:?string,
     *     description:?string,
     *     status:?string,
     *     repository_url:?string,
     *     live_url:?string,
     *     display:bool,
     *     created_at:?string,
     *     updated_at:?string,
     *     images:array<int,array{
     *         id:int,
     *         url:?string,
     *         alt:?string,
     *         title:?string,
     *         caption:?string,
     *         position:?int,
     *         is_cover:bool,
     *         owner_caption:?string
     *     }>,
     *     skills:array<int,array{id:int,name:string}>
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'locale' => $this->locale,
            'name' => $this->name,
            'summary' => $this->summary,
            'description' => $this->description,
            'status' => $this->status,
            'repository_url' => $this->repositoryUrl,
            'live_url' => $this->liveUrl,
            'display' => $this->display,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'images' => $this->images,
            'skills' => $this->skills,
        ];
    }
}
