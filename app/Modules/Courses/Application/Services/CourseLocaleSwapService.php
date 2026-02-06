<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\Services;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use App\Modules\Courses\Domain\Repositories\ICourseTranslationRepository;
use Illuminate\Support\Facades\DB;

final class CourseLocaleSwapService
{
    public function __construct(
        private readonly ICourseRepository $courses,
        private readonly ICourseTranslationRepository $translations,
    ) {
    }

    public function swap(Course $course, string $newLocale): Course
    {
        return DB::transaction(function () use ($course, $newLocale): Course {
            $translation = $this->translations->findByCourseAndLocale($course, $newLocale);

            if ($translation === null) {
                return $course;
            }

            $oldLocale = $course->locale;

            $basePayload = [
                'name' => $course->name,
                'institution' => $course->institution,
                'summary' => $course->summary,
                'description' => $course->description,
            ];

            $newBasePayload = [
                'name' => $translation->name,
                'institution' => $translation->institution,
                'summary' => $translation->summary,
                'description' => $translation->description,
            ];

            $this->courses->update($course, [
                'locale' => $newLocale,
                'name' => $newBasePayload['name'],
                'institution' => $newBasePayload['institution'],
                'summary' => $newBasePayload['summary'],
                'description' => $newBasePayload['description'],
            ]);

            $existingOldTranslation = $this->translations->findByCourseAndLocale(
                $course,
                $oldLocale,
            );

            if ($existingOldTranslation !== null) {
                $this->translations->update($existingOldTranslation, $basePayload);
            } else {
                $this->translations->create($course, $oldLocale, $basePayload);
            }

            $this->translations->delete($translation);

            return $course->refresh();
        });
    }
}
