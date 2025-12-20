<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Dtos;

use Carbon\CarbonInterface;

/**
 * Data transfer object representing a content-managed page.
 */
final class PageDto
{
    public function __construct(
        public readonly int $id,
        public readonly string $slug,
        public readonly string $internalName,
        public readonly string $title,
        public readonly ?string $metaTitle,
        public readonly ?string $metaDescription,
        public readonly ?string $metaImageUrl,
        public readonly ?string $layoutKey,
        public readonly string $locale,
        public readonly bool $isPublished,
        public readonly ?CarbonInterface $publishedAt,
        public readonly bool $isIndexable,
        public readonly ?CarbonInterface $createdAt,
        public readonly ?CarbonInterface $updatedAt,
    ) {
    }
}
