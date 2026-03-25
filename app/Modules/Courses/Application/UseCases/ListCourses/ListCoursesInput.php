<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\ListCourses;

use App\Modules\Courses\Domain\ValueObjects\CourseStatus;

final readonly class ListCoursesInput
{
    public function __construct(
        public int $perPage = 15,
        public ?string $search = null,
        public ?string $institution = null,
        public ?CourseStatus $status = null,
        public ?string $visibility = null,
        public ?string $sort = null,
        public ?string $direction = null,
    ) {
    }
}
