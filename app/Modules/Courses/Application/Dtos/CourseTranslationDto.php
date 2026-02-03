<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\Dtos;

use App\Modules\Courses\Domain\Models\CourseTranslation;

final class CourseTranslationDto
{
    public function __construct(
        public readonly int $id,
        public readonly int $courseId,
        public readonly string $locale,
        public readonly ?string $name,
        public readonly ?string $institution,
        public readonly ?string $summary,
        public readonly ?string $description,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(CourseTranslation $translation): self
    {
        return new self(
            id: $translation->id,
            courseId: $translation->course_id,
            locale: $translation->locale,
            name: $translation->name,
            institution: $translation->institution,
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
            'course_id' => $this->courseId,
            'locale' => $this->locale,
            'name' => $this->name,
            'institution' => $this->institution,
            'summary' => $this->summary,
            'description' => $this->description,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
