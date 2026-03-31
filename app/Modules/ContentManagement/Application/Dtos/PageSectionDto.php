<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Dtos;

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
        public readonly ?string $navigationLabel,
        public readonly array $data,
        public readonly bool $isActive,
        public readonly ?string $visibleFrom,
        public readonly ?string $visibleUntil,
        public readonly ?string $locale,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }
}
