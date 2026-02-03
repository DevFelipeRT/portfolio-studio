<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\ListCourseTranslations;

use App\Modules\Courses\Application\Dtos\CourseTranslationDto;
use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseTranslationRepository;

final class ListCourseTranslations
{
    public function __construct(
        private readonly ICourseTranslationRepository $translations,
    ) {
    }

    /**
     * @return array<int,CourseTranslationDto>
     */
    public function handle(Course $course): array
    {
        return $this->translations
            ->listByCourse($course)
            ->map(static fn($translation): CourseTranslationDto => CourseTranslationDto::fromModel($translation))
            ->all();
    }
}
