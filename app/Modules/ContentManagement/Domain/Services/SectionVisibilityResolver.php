<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Services;

use App\Modules\ContentManagement\Domain\Enums\SectionVisibility;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use Carbon\CarbonInterface;

/**
 * Resolves the SectionVisibility from low-level visibility fields.
 */
final class SectionVisibilityResolver
{
    /**
     * Derives the SectionVisibility from individual visibility fields.
     */
    public function resolve(
        bool $isActive,
        ?CarbonInterface $visibleFrom,
        ?CarbonInterface $visibleUntil,
        CarbonInterface $referenceTime,
    ): SectionVisibility {
        if ($isActive === false) {
            return SectionVisibility::Inactive;
        }

        if ($visibleFrom !== null && $referenceTime->lt($visibleFrom)) {
            return SectionVisibility::Scheduled;
        }

        if ($visibleUntil !== null && $referenceTime->gt($visibleUntil)) {
            return SectionVisibility::Expired;
        }

        return SectionVisibility::Visible;
    }

    /**
     * Helper to resolve visibility directly from a PageSection instance.
     */
    public function resolveForSection(
        PageSection $section,
        CarbonInterface $referenceTime,
    ): SectionVisibility {
        /** @var bool $isActive */
        $isActive = (bool) $section->is_active;

        /** @var CarbonInterface|null $visibleFrom */
        $visibleFrom = $section->visible_from instanceof CarbonInterface
            ? $section->visible_from
            : null;

        /** @var CarbonInterface|null $visibleUntil */
        $visibleUntil = $section->visible_until instanceof CarbonInterface
            ? $section->visible_until
            : null;

        return $this->resolve(
            $isActive,
            $visibleFrom,
            $visibleUntil,
            $referenceTime,
        );
    }
}
