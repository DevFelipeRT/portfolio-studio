<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\UpdateCourseTranslation;

use App\Modules\Courses\Domain\Models\CourseTranslation;

final readonly class UpdateCourseTranslationOutput
{
    public function __construct(
        public int $id,
        public int $courseId,
        public string $locale,
        public ?string $name,
        public ?string $institution,
        public ?string $summary,
        public ?string $description,
        public ?string $createdAt,
        public ?string $updatedAt,
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
