<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategories;

final readonly class ListSkillCategoryItem
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public string $locale,
        public ?string $createdAt,
        public ?string $updatedAt,
    ) {
    }

    /**
     * @return array{
     *     id:int,
     *     name:string,
     *     slug:string,
     *     locale:string,
     *     created_at:?string,
     *     updated_at:?string
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'locale' => $this->locale,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
