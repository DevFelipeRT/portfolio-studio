<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Enums;

/**
 * High-level publication state for content-managed pages.
 *
 * This enum represents the conceptual lifecycle of a Page.
 * It can be used by services and view models as an abstraction
 * over low-level fields such as is_published and published_at.
 */
enum PageStatus: string
{
    /**
     * Page is not yet published and is still being prepared.
     */
    case Draft = 'draft';

    /**
     * Page is published and should be considered part of the public site.
     */
    case Published = 'published';

    /**
     * Page is no longer active in the public site but kept for reference.
     */
    case Archived = 'archived';

    /**
     * Returns a human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Published',
            self::Archived => 'Archived',
        };
    }

    /**
     * Indicates whether the page is in draft state.
     */
    public function isDraft(): bool
    {
        return $this === self::Draft;
    }

    /**
     * Indicates whether the page is in published state.
     */
    public function isPublished(): bool
    {
        return $this === self::Published;
    }

    /**
     * Indicates whether the page is in archived state.
     */
    public function isArchived(): bool
    {
        return $this === self::Archived;
    }
}
