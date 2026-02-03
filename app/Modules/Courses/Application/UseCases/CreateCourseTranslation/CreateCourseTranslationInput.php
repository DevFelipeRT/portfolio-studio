<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\CreateCourseTranslation;

final class CreateCourseTranslationInput
{
    public function __construct(
        public readonly int $courseId,
        public readonly string $locale,
        public readonly ?string $name,
        public readonly ?string $institution,
        public readonly ?string $summary,
        public readonly ?string $description,
    ) {
    }
}
