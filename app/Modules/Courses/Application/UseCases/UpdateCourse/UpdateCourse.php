<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\UpdateCourse;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;

final class UpdateCourse
{
    public function __construct(private readonly ICourseRepository $courses)
    {
    }

    /**
     * @param array<string,mixed> $data
     */
    public function handle(Course $course, array $data): Course
    {
        $payload = $this->normalizePayload($data);

        return $this->courses->update($course, $payload);
    }

    /**
     * @param array<string,mixed> $data
     * @return array<string,mixed>
     */
    private function normalizePayload(array $data): array
    {
        if (!array_key_exists('display', $data)) {
            $data['display'] = false;
        }

        return $data;
    }
}
