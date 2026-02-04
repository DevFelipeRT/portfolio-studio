<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Dtos;

use App\Modules\Initiatives\Domain\Models\InitiativeTranslation;

final class InitiativeTranslationDto
{
    public function __construct(
        public readonly int $id,
        public readonly int $initiativeId,
        public readonly string $locale,
        public readonly ?string $name,
        public readonly ?string $summary,
        public readonly ?string $description,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(InitiativeTranslation $translation): self
    {
        return new self(
            id: $translation->id,
            initiativeId: $translation->initiative_id,
            locale: $translation->locale,
            name: $translation->name,
            summary: $translation->summary,
            description: $translation->description,
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
            'initiative_id' => $this->initiativeId,
            'locale' => $this->locale,
            'name' => $this->name,
            'summary' => $this->summary,
            'description' => $this->description,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
