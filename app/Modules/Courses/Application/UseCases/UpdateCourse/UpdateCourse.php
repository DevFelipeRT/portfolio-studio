<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\UpdateCourse;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use App\Modules\Courses\Domain\Repositories\ICourseTranslationRepository;
use App\Modules\Courses\Application\Services\CourseLocaleSwapService;
use Illuminate\Support\Facades\DB;

final class UpdateCourse
{
    public function __construct(
        private readonly ICourseRepository $courses,
        private readonly ICourseTranslationRepository $translations,
        private readonly CourseLocaleSwapService $localeSwapService,
    ) {
    }

    public function handle(Course $course, UpdateCourseInput $input): Course
    {
        return DB::transaction(function () use ($course, $input): Course {
            $localeChanged = $input->locale !== $course->locale;
            $shouldSwap = false;

            if ($localeChanged) {
                $existing = $this->translations->findByCourseAndLocale(
                    $course,
                    $input->locale,
                );
                $shouldSwap = $existing !== null && $input->confirmSwap;
            }

            if ($shouldSwap) {
                $course = $this->localeSwapService->swap($course, $input->locale);
            } else {
                $this->courses->update($course, [
                    'locale' => $input->locale,
                    'name' => $input->name,
                    'institution' => $input->institution,
                    'summary' => $input->summary,
                    'description' => $input->description,
                ]);
            }

            return $this->courses->update($course, [
                'category' => $input->category,
                'started_at' => $input->startedAt,
                'completed_at' => $input->completedAt,
                'display' => $input->display,
            ]);
        });
    }
}
