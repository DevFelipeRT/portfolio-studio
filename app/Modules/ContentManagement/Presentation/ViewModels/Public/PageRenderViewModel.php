<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\ViewModels\Public;

/**
 * View model representing a fully resolved content-managed page.
 */
final class PageRenderViewModel
{
    /**
     * @param array<int,array> $sections
     * @param array<string,mixed> $extraPayload
     */
    public function __construct(
        public readonly array $page,
        public readonly array $sections,
        public readonly array $extraPayload = [],
    ) {
    }
}
