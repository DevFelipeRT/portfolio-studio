<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Enums;

/**
 * Derived visibility state for a page section.
 *
 * This enum is intended to represent the result of evaluating
 * low-level visibility flags and time windows such as is_active,
 * visible_from and visible_until.
 *
 * The concrete mapping between raw fields and this enum should be
 * implemented in dedicated domain logic or resolvers.
 */
enum SectionVisibility: string
{
    /**
     * Section is not active and should not be rendered.
     */
    case Inactive = 'inactive';

    /**
     * Section is active but scheduled for a future time window.
     */
    case Scheduled = 'scheduled';

    /**
     * Section is active and currently within its visibility window.
     */
    case Visible = 'visible';

    /**
     * Section is active but its visibility window has already ended.
     */
    case Expired = 'expired';

    /**
     * Returns a human-readable label for the visibility state.
     */
    public function label(): string
    {
        return match ($this) {
            self::Inactive => 'Inactive',
            self::Scheduled => 'Scheduled',
            self::Visible => 'Visible',
            self::Expired => 'Expired',
        };
    }

    /**
     * Indicates whether the section should be considered visible.
     *
     * This method reflects the semantic interpretation of the enum
     * itself and does not inspect any model fields directly.
     */
    public function isVisible(): bool
    {
        return $this === self::Visible;
    }

    /**
     * Indicates whether the section is scheduled for future visibility.
     */
    public function isScheduled(): bool
    {
        return $this === self::Scheduled;
    }

    /**
     * Indicates whether the section has an expired visibility window.
     */
    public function isExpired(): bool
    {
        return $this === self::Expired;
    }

    /**
     * Indicates whether the section is effectively disabled.
     */
    public function isInactive(): bool
    {
        return $this === self::Inactive;
    }
}
