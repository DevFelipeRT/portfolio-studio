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

    public function handle(ListCoursesInput $input): LengthAwarePaginator
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        return $this->courses->paginateAdminList(
            perPage: $input->perPage,
            search: $input->search,
            institution: $input->institution,
            status: $input->status,
            visibility: $input->visibility,
            sort: $input->sort,
            direction: $input->direction,
            locale: $locale,
            fallbackLocale: $fallbackLocale,
        );
    }
}
