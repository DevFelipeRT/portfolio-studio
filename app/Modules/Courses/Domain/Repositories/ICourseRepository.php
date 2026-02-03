<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Repositories;

use App\Modules\Courses\Domain\Models\Course;

interface ICourseRepository
{
    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
    );

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int,Course>
     */
    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    );

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
