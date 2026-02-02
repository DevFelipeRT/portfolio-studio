<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Dtos;

use App\Modules\Skills\Domain\Models\SkillCategoryTranslation;

final class SkillCategoryTranslationDto
{
    public function __construct(
        public readonly int $id,
        public readonly int $skillCategoryId,
        public readonly string $locale,
        public readonly string $name,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(SkillCategoryTranslation $translation): self
    {
        return new self(
            id: $translation->id,
            skillCategoryId: $translation->skill_category_id,
            locale: $translation->locale,
            name: $translation->name,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'skill_category_id' => $this->skillCategoryId,
            'locale' => $this->locale,
            'name' => $this->name,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
