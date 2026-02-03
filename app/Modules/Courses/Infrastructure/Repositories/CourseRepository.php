<?php

declare(strict_types=1);

namespace App\Modules\Courses\Infrastructure\Repositories;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class CourseRepository implements ICourseRepository
{
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator {
        return $this->withTranslations(
            Course::query(),
            $locale,
            $fallbackLocale,
        )
            ->orderByDesc('started_at')
            ->orderBy('name')
            ->paginate($perPage);
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
            ->where('display', true)
            ->orderByDesc('started_at')
            ->orderByDesc('id')
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
