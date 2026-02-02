<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Dtos;

use App\Modules\Skills\Domain\Models\SkillCategory;

final class SkillCategoryDto
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $slug,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(
        SkillCategory $category,
        ?string $name = null,
    ): self {
        return new self(
            id: $category->id,
            name: $name ?? $category->name,
            slug: $category->slug,
            createdAt: $category->created_at?->toJSON(),
            updatedAt: $category->updated_at?->toJSON(),
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
            'slug' => $this->slug,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
