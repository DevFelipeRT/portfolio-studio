<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Services;

use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use App\Modules\ContentManagement\Domain\Models\Page;
use Carbon\CarbonInterface;

/**
 * Resolves the high-level PageStatus from low-level state fields.
 */
final class PageStatusResolver
{
    /**
     * Derives the PageStatus from individual state fields.
     */
    public function resolve(
        bool $isPublished,
        ?CarbonInterface $publishedAt,
    ): PageStatus {
        if ($isPublished === false && $publishedAt === null) {
            return PageStatus::Draft;
        }

        if ($isPublished === true) {
            return PageStatus::Published;
        }

        return PageStatus::Archived;
    }

    /**
     * Helper to resolve status directly from a Page instance.
     */
    public function resolveForPage(Page $page): PageStatus
    {
        /** @var bool $isPublished */
        $isPublished = (bool) $page->is_published;

        /** @var CarbonInterface|null $publishedAt */
        $publishedAt = $page->published_at instanceof CarbonInterface
            ? $page->published_at
            : null;

        return $this->resolve($isPublished, $publishedAt);
    }
}
