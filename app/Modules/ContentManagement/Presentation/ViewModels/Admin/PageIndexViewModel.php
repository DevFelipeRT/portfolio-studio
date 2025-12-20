<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\ViewModels\Admin;

use App\Modules\ContentManagement\Application\Dtos\PageDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * View model representing the administrative page index screen.
 */
final class PageIndexViewModel
{
    /**
     * @param LengthAwarePaginator<PageDto> $pages
     * @param array<string,mixed>           $filters
     * @param array<string,mixed>           $extraPayload
     */
    public function __construct(
        public readonly LengthAwarePaginator $pages,
        public readonly array $filters = [],
        public readonly array $extraPayload = [],
    ) {
    }
}
