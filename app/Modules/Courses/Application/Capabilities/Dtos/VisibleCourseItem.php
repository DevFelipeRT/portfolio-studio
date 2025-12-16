<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\Capabilities\Dtos;

use App\Modules\Courses\Domain\Models\Course;

/**
 * Data transfer object for a public visible course item.
 */
final class VisibleCourseItem
{
    public function __construct(
        private readonly int $id,
        private readonly string $name,
        private readonly ?string $institution,
        private readonly string $category,
        private readonly string $status,
        private readonly ?string $summary,
        private readonly ?string $description,
        private readonly ?string $startedAt,
        private readonly ?string $completedAt,
        private readonly bool $display,
        private readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(Course $course): self
    {
        return new self(
            $course->id,
            $course->name,
            $course->institution,
            $course->category->value,
            $course->status->value,
            $course->summary,
            $course->description,
            $course->started_at !== null ? (string) $course->started_at : null,
            $course->completed_at !== null ? (string) $course->completed_at : null,
            (bool) $course->display,
            $course->updated_at !== null ? (string) $course->updated_at : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'institution' => $this->institution,
            'category' => $this->category,
            'status' => $this->status,
            'summary' => $this->summary,
            'description' => $this->description,
            'started_at' => $this->startedAt,
            'completed_at' => $this->completedAt,
            'display' => $this->display,
            'updated_at' => $this->updatedAt,
        ];
    }
}
