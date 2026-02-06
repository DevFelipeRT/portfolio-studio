<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Mappers;

use App\Modules\Courses\Application\UseCases\CreateCourse\CreateCourseInput;
use App\Modules\Courses\Application\UseCases\UpdateCourse\UpdateCourseInput;
use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Http\Requests\Course\StoreCourseRequest;
use App\Modules\Courses\Http\Requests\Course\UpdateCourseRequest;

final class CourseInputMapper
{
    public static function fromStoreRequest(StoreCourseRequest $request): CreateCourseInput
    {
        $data = $request->validated();

        return new CreateCourseInput(
            locale: $data['locale'],
            name: $data['name'],
            institution: $data['institution'],
            category: $data['category'],
            summary: $data['summary'],
            description: $data['description'],
            startedAt: $data['started_at'] ?? null,
            completedAt: $data['completed_at'] ?? null,
            display: (bool) ($data['display'] ?? false),
        );
    }

    public static function fromUpdateRequest(
        UpdateCourseRequest $request,
        Course $course,
    ): UpdateCourseInput {
        $data = $request->validated();

        return new UpdateCourseInput(
            locale: $data['locale'],
            confirmSwap: (bool) ($data['confirm_swap'] ?? false),
            name: $data['name'],
            institution: $data['institution'],
            category: $data['category'],
            summary: $data['summary'],
            description: $data['description'],
            startedAt: $data['started_at'] ?? null,
            completedAt: $data['completed_at'] ?? null,
            display: (bool) ($data['display'] ?? $course->display),
        );
    }
}
