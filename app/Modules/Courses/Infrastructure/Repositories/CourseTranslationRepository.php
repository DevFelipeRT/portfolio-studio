<?php

declare(strict_types=1);

namespace App\Modules\Courses\Infrastructure\Repositories;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Models\CourseTranslation;
use App\Modules\Courses\Domain\Repositories\ICourseTranslationRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class CourseTranslationRepository implements ICourseTranslationRepository
{
    public function listByCourse(Course $course): EloquentCollection
    {
        return $course->translations()->orderBy('locale')->get();
    }

    public function findByCourseAndLocale(Course $course, string $locale): ?CourseTranslation
    {
        return $course
            ->translations()
            ->where('locale', $locale)
            ->first();
    }

    public function create(Course $course, string $locale, array $data): CourseTranslation
    {
        return $course->translations()->create([
            'locale' => $locale,
            'name' => $data['name'] ?? null,
            'institution' => $data['institution'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
        ]);
    }

    public function update(CourseTranslation $translation, array $data): CourseTranslation
    {
        $translation->update([
            'name' => $data['name'] ?? null,
            'institution' => $data['institution'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        return $translation;
    }

    public function delete(CourseTranslation $translation): void
    {
        $translation->delete();
    }
}
