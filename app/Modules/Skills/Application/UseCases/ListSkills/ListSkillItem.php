<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkills;

final readonly class ListSkillItem
{
    /**
     * @param array{id:int,name:string}|null $category
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $locale,
        public ?int $skillCategoryId,
        public ?array $category,
        public ?string $createdAt,
        public ?string $updatedAt,
    ) {
    }

    /**
     * @return array{
     *     id:int,
     *     name:string,
     *     locale:string,
     *     skill_category_id:?int,
     *     category:array{id:int,name:string}|null,
     *     created_at:?string,
     *     updated_at:?string
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'locale' => $this->locale,
            'skill_category_id' => $this->skillCategoryId,
            'category' => $this->category,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
