<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\CreateCourse;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;

final class CreateCourse
{
    public function __construct(private readonly ICourseRepository $courses)
    {
    }

    public function handle(CreateCourseInput $input): Course
    {
        return $this->courses->create([
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
