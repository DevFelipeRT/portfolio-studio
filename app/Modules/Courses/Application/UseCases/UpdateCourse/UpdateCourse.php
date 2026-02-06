<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\UpdateCourse;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;

final class UpdateCourse
{
    public function __construct(private readonly ICourseRepository $courses)
    {
    }

    public function handle(Course $course, UpdateCourseInput $input): Course
    {
        return $this->courses->update($course, [
            'locale' => $input->locale,
            'name' => $input->name,
            'institution' => $input->institution,
            'category' => $input->category,
            'summary' => $input->summary,
            'description' => $input->description,
            'started_at' => $input->startedAt,
            'completed_at' => $input->completedAt,
            'display' => $input->display,
        ]);
    }
}
