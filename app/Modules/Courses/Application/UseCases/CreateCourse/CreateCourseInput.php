<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\CreateCourse;

final class CreateCourseInput
{
    public function __construct(
        public readonly string $name,
        public readonly string $institution,
        public readonly string $category,
        public readonly string $summary,
        public readonly string $description,
        public readonly ?string $startedAt,
        public readonly ?string $completedAt,
        public readonly bool $display,
    ) {
    }
}
