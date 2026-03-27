<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjects;

final readonly class ListProjectItem
{
    public function __construct(
        public int $id,
        public string $locale,
        public string $name,
        public ?string $summary,
        public ?string $status,
        public bool $display,
        public int $imageCount,
    ) {
    }

    /**
     * @return array{
     *     id:int,
     *     locale:string,
     *     name:string,
     *     summary:?string,
     *     status:?string,
     *     display:bool,
     *     image_count:int
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'locale' => $this->locale,
            'name' => $this->name,
            'summary' => $this->summary,
            'status' => $this->status,
            'display' => $this->display,
            'image_count' => $this->imageCount,
        ];
    }
}
