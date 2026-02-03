<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Repositories;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Models\CourseTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface ICourseTranslationRepository
{
    /**
     * @return EloquentCollection<int,CourseTranslation>
     */
    public function listByCourse(Course $course): EloquentCollection;

    public function findByCourseAndLocale(Course $course, string $locale): ?CourseTranslation;

    /**
     * @param array{name?:string|null,institution?:string|null,summary?:string|null,description?:string|null} $data
     */
    public function create(Course $course, string $locale, array $data): CourseTranslation;

    /**
     * @param array{name?:string|null,institution?:string|null,summary?:string|null,description?:string|null} $data
     */
    public function update(CourseTranslation $translation, array $data): CourseTranslation;

    public function delete(CourseTranslation $translation): void;
}
