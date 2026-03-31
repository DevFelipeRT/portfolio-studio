<?php

declare(strict_types=1);

namespace App\Modules\Courses\Infrastructure\Repositories;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use App\Modules\Courses\Domain\ValueObjects\CourseStatus;
use App\Modules\Courses\Infrastructure\Queries\CourseAdminListQuery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class CourseRepository implements ICourseRepository
{
    public function __construct(
        private readonly CourseAdminListQuery $courseAdminListQuery,
    ) {}

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
    ): LengthAwarePaginator {
        return $this->courseAdminListQuery->paginate(
            perPage: $perPage,
            search: $search,
            institution: $institution,
            status: $status,
            visibility: $visibility,
            sort: $sort,
            direction: $direction,
            locale: $locale,
            fallbackLocale: $fallbackLocale,
        );
    }

    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            Course::query(),
            $locale,
            $fallbackLocale,
        )
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->where('display', true)
            ->get();
    }

    public function findById(int $id): Course
    {
        return Course::query()->findOrFail($id);
    }

    public function create(array $attributes): Course
    {
        return Course::query()->create($attributes);
    }

    public function update(Course $course, array $attributes): Course
    {
        $course->update($attributes);

        return $course;
    }

    public function delete(Course $course): void
    {
        $course->delete();
    }

    private function withTranslations(
        Builder $query,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Builder {
        $locales = $this->normalizeLocales($locale, $fallbackLocale);

        if ($locales !== []) {
            $query->with([
                'translations' => static fn($relation) => $relation->whereIn('locale', $locales),
            ]);
        }

        return $query;
    }

    /**
     * @return array<int,string>
     */
    private function normalizeLocales(?string $locale, ?string $fallbackLocale): array
    {
        $values = array_filter([
            $locale !== null ? trim($locale) : null,
            $fallbackLocale !== null ? trim($fallbackLocale) : null,
        ]);

        return array_values(array_unique($values));
    }
}
