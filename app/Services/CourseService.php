<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service responsible for managing courses.
 */
class CourseService
{
    /**
     * Return a paginated list of courses ordered by start date and name.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Course::query()
            ->orderByDesc('started_at')
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * Create a new course from validated data.
     */
    public function create(array $data): Course
    {
        $payload = $this->normalizePayload($data);

        return Course::query()->create($payload);
    }

    /**
     * Update an existing course with validated data.
     */
    public function update(Course $course, array $data): Course
    {
        $payload = $this->normalizePayload($data);

        $course->fill($payload);
        $course->save();

        return $course;
    }

    /**
     * Delete the given course.
     */
    public function delete(Course $course): void
    {
        $course->delete();
    }

    /**
     * Retrieve only courses flagged for display, ordered by most recent first.
     *
     * @return Collection<int,Course>
     */
    public function visible(): Collection
    {
        return Course::query()
            ->where('display', true)
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->get();
    }

    /**
     * Normalize the payload before persistence.
     */
    private function normalizePayload(array $data): array
    {
        if (!array_key_exists('display', $data)) {
            $data['display'] = false;
        }

        return $data;
    }
}
