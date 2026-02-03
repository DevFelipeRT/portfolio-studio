<?php

declare(strict_types=1);

namespace App\Modules\Courses\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Mapping\Mapper;
use App\Modules\Courses\Application\Services\CourseTranslationResolver;
use App\Modules\Courses\Domain\Models\Course;

final class CourseMapper extends Mapper
{
    protected static string $modelClass = Course::class;

    protected static function map(mixed $model): array
    {
        /** @var Course $course */
        $course = $model;
        $resolver = app(CourseTranslationResolver::class);
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $name = $resolver->resolveName($course, $locale, $fallbackLocale);
        $institution = $resolver->resolveInstitution($course, $locale, $fallbackLocale);
        $summary = $resolver->resolveSummary($course, $locale, $fallbackLocale);
        $description = $resolver->resolveDescription($course, $locale, $fallbackLocale);

        return [
            'id' => $course->id,
            'name' => $name,
            'institution' => $institution,
            'category' => $course->category,
            'status' => $course->status,
            'summary' => $summary,
            'description' => $description,
            'started_at' => self::formatDate($course->started_at),
            'completed_at' => self::formatDate($course->completed_at),
            'display' => $course->display,
            'updated_at' => self::formatDate($course->updated_at),
        ];
    }
}
