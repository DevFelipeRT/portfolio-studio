<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Repositories;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\ValueObjects\CourseStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ICourseRepository
{
    public function paginateAdminList(
        int $perPage,
        ?string $search,
        ?string $institution,
        ?CourseStatus $status,
        ?string $visibility,
        ?string $sort,
        ?string $direction,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator;

    /**
     * @return Collection<int,Course>
     */
    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection;

    public function findById(int $id): Course;

    /**
     * @param array<string,mixed> $attributes
     */
    public function create(array $attributes): Course;

    /**
     * @param array<string,mixed> $attributes
     */
    public function update(Course $course, array $attributes): Course;

    public function delete(Course $course): void;
}
