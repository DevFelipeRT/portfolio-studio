<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Mappers;

use App\Modules\ContentManagement\Application\Dtos\PageSectionDto;
use App\Modules\ContentManagement\Domain\Models\PageSection;

/**
 * Maps PageSection domain models to PageSectionDto instances and array payloads.
 */
final class PageSectionMapper
{
    /**
     * Builds a PageSectionDto from a PageSection model.
     */
    public static function toDto(PageSection $section): PageSectionDto
    {
        $data = $section->data ?? [];

        if (!is_array($data)) {
            $data = [];
        }

        return new PageSectionDto(
            id: (int) $section->id,
            pageId: (int) $section->page_id,
            templateKey: (string) $section->template_key,
            slot: $section->slot,
            position: (int) $section->position,
            anchor: $section->anchor,
            data: $data,
            isActive: (bool) $section->is_active,
            visibleFrom: $section->visible_from,
            visibleUntil: $section->visible_until,
            locale: $section->locale,
        );
    }

    /**
     * Builds an array payload suitable for frontend consumption from a PageSection model.
     *
     * @return array<string,mixed>
     */
    public static function toArray(PageSection $section): array
    {
        $dto = self::toDto($section);

        return [
            'id' => $dto->id,
            'page_id' => $dto->pageId,
            'template_key' => $dto->templateKey,
            'slot' => $dto->slot,
            'position' => $dto->position,
            'anchor' => $dto->anchor,
            'data' => $dto->data,
            'is_active' => $dto->isActive,
            'visible_from' => $dto->visibleFrom,
            'visible_until' => $dto->visibleUntil,
            'locale' => $dto->locale,
        ];
    }
}
