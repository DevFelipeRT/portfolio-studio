<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\ListVisibleExperiences;

use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use Illuminate\Database\Eloquent\Collection;

final class ListVisibleExperiences
{
    public function __construct(private readonly IExperienceRepository $experiences)
    {
    }

    /**
     * @return Collection<int,\App\Modules\Experiences\Domain\Models\Experience>
     */
    public function handle(): Collection
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        return $this->experiences->visibleWithTranslations($locale, $fallbackLocale);
    }
}
