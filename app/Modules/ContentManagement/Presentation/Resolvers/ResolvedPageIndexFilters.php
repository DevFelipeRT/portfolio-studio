<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Resolvers;

use App\Modules\ContentManagement\Domain\Enums\PageStatus;

/**
 * Immutable resolved filter state for the admin page index.
 */
final readonly class ResolvedPageIndexFilters
{
    public function __construct(
        public ?PageStatus $status,
        public ?string $locale,
        public ?string $search,
        public string $sort,
        public string $direction,
    ) {
    }

    /**
     * Returns a presentation-ready filter payload for the view model.
     *
     * @return array<string,mixed>
     */
    public function toArray(int $perPage): array
    {
        return [
            'per_page' => $perPage,
            'status' => $this->status?->value,
            'locale' => $this->locale,
            'search' => $this->search,
            'sort' => $this->sort,
            'direction' => $this->direction,
        ];
    }
}
