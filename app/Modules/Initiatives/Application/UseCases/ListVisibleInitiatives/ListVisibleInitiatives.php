<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\ListVisibleInitiatives;

use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use Illuminate\Database\Eloquent\Collection;

final class ListVisibleInitiatives
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
    ) {
    }

    /**
     * @return Collection<int,\App\Modules\Initiatives\Domain\Models\Initiative>
     */
    public function handle(?string $locale, ?string $fallbackLocale = null): Collection
    {
        return $this->initiatives->visibleWithTranslations($locale, $fallbackLocale);
    }
}
