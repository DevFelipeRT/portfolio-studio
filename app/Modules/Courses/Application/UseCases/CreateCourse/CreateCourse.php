<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\CreateCourse;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use App\Modules\Shared\Contracts\RichText\IRichTextService;

final class CreateCourse
{
    public function __construct(
        private readonly ICourseRepository $courses,
        private readonly IRichTextService $richText,
    ) {
    }

    public function handle(CreateCourseInput $input): Course
    {
        $preparedDescription = $this->richText->prepareForPersistence($input->description, 'description');

        return $this->courses->create([
            'locale' => $input->locale,
            'name' => $input->name,
            'institution' => $input->institution,
            'category' => $input->category,
            'summary' => $input->summary,
            'description' => $preparedDescription->normalized(),
            'started_at' => $input->startedAt,
            'completed_at' => $input->completedAt,
            'display' => $input->display,
        ]);
    }
}
