<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Dtos;

use App\Modules\Skills\Domain\Models\SkillTranslation;

final class SkillTranslationDto
{
    public function __construct(
        public readonly int $id,
        public readonly int $skillId,
        public readonly string $locale,
        public readonly string $name,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(SkillTranslation $translation): self
    {
        return new self(
            id: $translation->id,
            skillId: $translation->skill_id,
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
            'skill_id' => $this->skillId,
            'locale' => $this->locale,
            'name' => $this->name,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
