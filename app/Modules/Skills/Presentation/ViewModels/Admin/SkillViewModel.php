<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

use App\Modules\Skills\Application\UseCases\ListSkills\ListSkillItem;
use App\Modules\Skills\Domain\Models\Skill;

final readonly class SkillViewModel
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

    public static function fromListItem(ListSkillItem $item): self
    {
        return new self(
            id: $item->id,
            name: $item->name,
            locale: $item->locale,
            skillCategoryId: $item->skillCategoryId,
            category: $item->category,
            createdAt: $item->createdAt,
            updatedAt: $item->updatedAt,
        );
    }

    public static function fromModel(Skill $skill): self
    {
        return new self(
            id: $skill->id,
            name: $skill->name,
            locale: $skill->locale,
            skillCategoryId: $skill->skill_category_id,
            category: $skill->category !== null
                ? [
                    'id' => $skill->category->id,
                    'name' => $skill->category->name,
                ]
                : null,
            createdAt: $skill->created_at?->toJSON(),
            updatedAt: $skill->updated_at?->toJSON(),
        );
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
