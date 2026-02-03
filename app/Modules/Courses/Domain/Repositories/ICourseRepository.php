<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Repositories;

use App\Modules\Courses\Domain\Models\Course;

interface ICourseRepository
{
    public function findById(int $id): Course;
}
