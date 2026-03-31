<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Mappers;

use App\Modules\Courses\Application\UseCases\CreateCourse\CreateCourseInput;
use App\Modules\Courses\Http\Requests\Course\StoreCourseRequest;

final class CreateCourseInputMapper
{
    public function fromRequest(StoreCourseRequest $request): CreateCourseInput
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
}
