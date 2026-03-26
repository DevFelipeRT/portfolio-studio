<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\ListInitiatives;

use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListInitiatives
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
    ) {
    }

    /**
     * @return array{
     *     initiatives: LengthAwarePaginator,
     *     visible_count: int
     * }
     */
    public function handle(
        ?string $locale,
        ?string $fallbackLocale = null,
        int $perPage = 15,
        int $page = 1,
        ?string $search = null,
        ?string $displayFilter = null,
        ?string $hasImages = null,
        ?string $sort = null,
        ?string $direction = null,
    ): array
    {
        return [
            'initiatives' => $this->initiatives->paginateWithTranslations(
                $perPage,
                $locale,
                $fallbackLocale,
                $page,
                $search,
                $displayFilter,
                $hasImages,
                $sort,
                $direction,
            ),
            'visible_count' => $this->initiatives->countVisible(
                $locale,
                $fallbackLocale,
                $search,
                $displayFilter,
                $hasImages,
            ),
        ];
    }
}
