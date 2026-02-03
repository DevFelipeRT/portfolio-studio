<?php

declare(strict_types=1);

namespace App\Modules\Courses\Infrastructure\Repositories;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;

final class CourseRepository implements ICourseRepository
{
    public function findById(int $id): Course
    {
        return Course::query()->findOrFail($id);
    }
}
