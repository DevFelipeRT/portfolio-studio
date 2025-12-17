<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Mappers;

use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Domain\Models\Page;

/**
 * Maps Page domain models to PageDto instances and array payloads.
 */
final class PageMapper
{
    /**
     * Builds a PageDto from a Page model.
     */
    public static function toDto(Page $page): PageDto
    {
        $metaImageUrl = null;

        if ($page->relationLoaded('metaImage') || $page->meta_image_id !== null) {
            $metaImageUrl = $page->metaImage?->url;
        }

        return new PageDto(
            id: (int) $page->id,
            slug: (string) $page->slug,
            internalName: (string) $page->internal_name,
            title: (string) $page->title,
            metaTitle: $page->meta_title,
            metaDescription: $page->meta_description,
            metaImageUrl: $metaImageUrl,
            layoutKey: $page->layout_key,
            locale: (string) $page->locale,
            isPublished: (bool) $page->is_published,
            publishedAt: $page->published_at,
            isIndexable: (bool) $page->is_indexable,
            createdAt: $page->created_at,
            updatedAt: $page->updated_at,
        );
    }

    /**
     * Builds an array payload suitable for frontend consumption from a Page model.
     *
     * @return array<string,mixed>
     */
    public static function toArray(Page $page): array
    {
        $dto = self::toDto($page);

        return [
            'id' => $dto->id,
            'slug' => $dto->slug,
            'internal_name' => $dto->internalName,
            'title' => $dto->title,
            'meta_title' => $dto->metaTitle,
            'meta_description' => $dto->metaDescription,
            'meta_image_url' => $dto->metaImageUrl,
            'layout_key' => $dto->layoutKey,
            'locale' => $dto->locale,
            'is_published' => $dto->isPublished,
            'published_at' => $dto->publishedAt,
            'is_indexable' => $dto->isIndexable,
        ];
    }
}
