<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\DeleteCourse;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;

final class DeleteCourse
{
    public function __construct(private readonly ICourseRepository $courses)
    {
    }

    public function handle(Course $course): void
    {
        $this->courses->delete($course);
    }
}
