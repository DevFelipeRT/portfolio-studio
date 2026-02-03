<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\DeleteCourseTranslation;

use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use App\Modules\Courses\Domain\Repositories\ICourseTranslationRepository;
use InvalidArgumentException;

final class DeleteCourseTranslation
{
    public function __construct(
        private readonly ICourseRepository $courses,
        private readonly ICourseTranslationRepository $translations,
    ) {
    }

    public function handle(int $courseId, string $locale): void
    {
        $course = $this->courses->findById($courseId);

        $existing = $this->translations->findByCourseAndLocale($course, $locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Course translation not found for this locale.');
        }

        $this->translations->delete($existing);
    }
}
