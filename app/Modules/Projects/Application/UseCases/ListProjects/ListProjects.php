<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjects;

use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use Illuminate\Database\Eloquent\Collection;

final class ListProjects
{
    public function __construct(private readonly IProjectRepository $projects)
    {
    }

    /**
     * @return Collection<int,\App\Modules\Projects\Domain\Models\Project>
     */
    public function handle(): Collection
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        return $this->projects->allWithTranslations($locale, $fallbackLocale);
    }
}
