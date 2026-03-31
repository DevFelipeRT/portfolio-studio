<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategoryItem;
use App\Modules\Skills\Domain\Models\SkillCategory;

final readonly class SkillCategoryViewModel
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

    public static function fromListItem(ListSkillCategoryItem $item): self
    {
        return new self(
            id: $item->id,
            name: $item->name,
            slug: $item->slug,
            locale: $item->locale,
            createdAt: $item->createdAt,
            updatedAt: $item->updatedAt,
        );
    }

    public static function fromModel(SkillCategory $category): self
    {
        return new self(
            id: $category->id,
            name: $category->name,
            slug: $category->slug,
            locale: $category->locale,
            createdAt: $category->created_at?->toJSON(),
            updatedAt: $category->updated_at?->toJSON(),
        );
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
