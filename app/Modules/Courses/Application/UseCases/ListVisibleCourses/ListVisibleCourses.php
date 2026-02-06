<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\ListVisibleCourses;

use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use Illuminate\Database\Eloquent\Collection;

final class ListVisibleCourses
{
    public function __construct(private readonly ICourseRepository $courses)
    {
    }

    /**
     * @return Collection<int,\App\Modules\Courses\Domain\Models\Course>
     */
    public function handle(?string $locale = null, ?string $fallbackLocale = null): Collection
    {
        $locale ??= app()->getLocale();
        $fallbackLocale ??= app()->getFallbackLocale();

        return $this->courses->visibleWithTranslations($locale, $fallbackLocale);
    }
}
