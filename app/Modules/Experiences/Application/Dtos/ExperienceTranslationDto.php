<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\Dtos;

use App\Modules\Experiences\Domain\Models\ExperienceTranslation;

final class ExperienceTranslationDto
{
    public function __construct(
        public readonly int $id,
        public readonly int $experienceId,
        public readonly string $locale,
        public readonly ?string $position,
        public readonly ?string $company,
        public readonly ?string $summary,
        public readonly ?string $description,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(ExperienceTranslation $translation): self
    {
        return new self(
            id: $translation->id,
            experienceId: $translation->experience_id,
            locale: $translation->locale,
            position: $translation->position,
            company: $translation->company,
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
            'experience_id' => $this->experienceId,
            'locale' => $this->locale,
            'position' => $this->position,
            'company' => $this->company,
            'summary' => $this->summary,
            'description' => $this->description,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
