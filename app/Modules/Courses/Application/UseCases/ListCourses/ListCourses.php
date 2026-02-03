<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\ListCourses;

use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListCourses
{
    public function __construct(private readonly ICourseRepository $courses)
    {
    }

    public function handle(int $perPage = 15): LengthAwarePaginator
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        return $this->courses->paginateWithTranslations($perPage, $locale, $fallbackLocale);
    }
}
