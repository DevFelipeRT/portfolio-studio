<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Dtos;

use App\Modules\Skills\Domain\Models\Skill;

final class SkillDto
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly ?int $skillCategoryId,
        public readonly ?SkillCategoryDto $category,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(
        Skill $skill,
        ?string $name = null,
        ?SkillCategoryDto $category = null,
    ): self {
        return new self(
            id: $skill->id,
            name: $name ?? $skill->name,
            skillCategoryId: $skill->skill_category_id,
            category: $category,
            createdAt: $skill->created_at?->toJSON(),
            updatedAt: $skill->updated_at?->toJSON(),
        );
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'skill_category_id' => $this->skillCategoryId,
            'category' => $this->category?->toArray(),
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
