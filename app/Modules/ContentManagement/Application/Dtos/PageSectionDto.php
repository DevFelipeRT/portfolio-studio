<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Dtos;

use Carbon\CarbonInterface;

/**
 * Data transfer object representing a single page section.
 */
final class PageSectionDto
{
    /**
     * @param array<string,mixed> $data
     */
    public function __construct(
        public readonly int $id,
        public readonly int $pageId,
        public readonly string $templateKey,
        public readonly ?string $slot,
        public readonly int $position,
        public readonly ?string $anchor,
        public readonly array $data,
        public readonly bool $isActive,
        public readonly ?CarbonInterface $visibleFrom,
        public readonly ?CarbonInterface $visibleUntil,
        public readonly ?string $locale,
    ) {
    }
}
