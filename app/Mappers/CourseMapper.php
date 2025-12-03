<?php

declare(strict_types=1);

namespace App\Mappers;

use App\Models\Course;

final class CourseMapper extends Mapper
{
    protected static string $modelClass = Course::class;

    protected static function map(mixed $model): array
    {
        /** @var Course $course */
        $course = $model;

        return [
            'id' => $course->id,
            'name' => $course->name,
            'institution' => $course->institution,
            'category' => $course->category,
            'status' => $course->status,
            'summary' => $course->summary,
            'description' => $course->description,
            'started_at' => self::formatDate($course->started_at),
            'completed_at' => self::formatDate($course->completed_at),
            'display' => $course->display,
            'updated_at' => self::formatDate($course->updated_at),
        ];
    }
}
