<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Services;

use App\Modules\ContentManagement\Domain\Models\PageSection;
use Illuminate\Support\Arr;

/**
 * Synchronizes image attachments for page sections based on template media fields.
 *
 * This service expects the caller to provide a list of media fields defined in the template
 * and the validated section data payload.
 */
final class PageSectionImageService
{
    /**
     * Synchronizes image attachments for the given section.
     *
     * @param PageSection $section Section that owns the images.
     * @param array<int,array{name: string, type: string}> $mediaFields Media field definitions
     *        coming from the template (only fields of type "image" or "image_gallery").
     * @param array<string,mixed> $data Validated section data payload (data[...] from the request).
     */
    public function syncSectionImages(
        PageSection $section,
        array $mediaFields,
        array $data
    ): void {
        if ($mediaFields === []) {
            // No media fields defined for this template, nothing to sync.
            return;
        }

        $syncPayload = [];

        foreach ($mediaFields as $fieldDefinition) {
            $fieldName = $fieldDefinition['name'] ?? null;
            $fieldType = $fieldDefinition['type'] ?? null;

            if (!is_string($fieldName) || !is_string($fieldType)) {
                continue;
            }

            $slot = $fieldName;

            if (!array_key_exists($fieldName, $data)) {
                continue;
            }

            $fieldValue = $data[$fieldName];

            if ($fieldType === 'image') {
                $this->appendSingleImageSlot(
                    $syncPayload,
                    $slot,
                    $fieldValue,
                );

                continue;
            }

            if ($fieldType === 'image_gallery') {
                $this->appendGallerySlot(
                    $syncPayload,
                    $slot,
                    $fieldValue,
                );
            }
        }

        if ($syncPayload === []) {
            // No images to sync, detach all existing attachments for this section.
            $section->images()->detach();

            return;
        }

        $section->images()->sync($syncPayload);
    }

    /**
     * Appends a single-image slot to the sync payload.
     *
     * @param array<int,array<string,mixed>> $syncPayload
     * @param string $slot
     * @param mixed $fieldValue
     */
    private function appendSingleImageSlot(
        array &$syncPayload,
        string $slot,
        mixed $fieldValue
    ): void {
        if ($fieldValue === null || $fieldValue === '') {
            return;
        }

        $imageId = $this->normalizeToIntegerId($fieldValue);

        if ($imageId === null) {
            return;
        }

        $syncPayload[$imageId] = [
            'slot' => $slot,
            'position' => 0,
            'is_cover' => true,
            'caption' => null,
        ];
    }

    /**
     * Appends a gallery slot to the sync payload.
     *
     * @param array<int,array<string,mixed>> $syncPayload
     * @param string $slot
     * @param mixed $fieldValue
     */
    private function appendGallerySlot(
        array &$syncPayload,
        string $slot,
        mixed $fieldValue
    ): void {
        if (!is_array($fieldValue)) {
            return;
        }

        $position = 0;

        foreach ($fieldValue as $rawItem) {
            $imageId = $this->extractImageIdFromGalleryItem($rawItem);

            if ($imageId === null) {
                continue;
            }

            $syncPayload[$imageId] = [
                'slot' => $slot,
                'position' => $position,
                'is_cover' => $position === 0,
                'caption' => $this->extractCaptionFromGalleryItem($rawItem),
            ];

            $position++;
        }
    }

    /**
     * Normalizes a scalar value into an integer image identifier.
     *
     * @param mixed $value
     * @return int|null
     */
    private function normalizeToIntegerId(mixed $value): ?int
    {
        if (is_int($value)) {
            return $value;
        }

        if (is_string($value) && $value !== '' && ctype_digit($value)) {
            $intValue = (int) $value;

            return $intValue >= 1 ? $intValue : null;
        }

        return null;
    }

    /**
     * Extracts the image identifier from a gallery item.
     *
     * @param mixed $item
     * @return int|null
     */
    private function extractImageIdFromGalleryItem(mixed $item): ?int
    {
        if (is_int($item) || is_string($item)) {
            return $this->normalizeToIntegerId($item);
        }

        if (!is_array($item)) {
            return null;
        }

        $rawId = Arr::get($item, 'id');

        return $this->normalizeToIntegerId($rawId);
    }

    /**
     * Extracts a caption from a gallery item if available.
     *
     * @param mixed $item
     * @return string|null
     */
    private function extractCaptionFromGalleryItem(mixed $item): ?string
    {
        if (!is_array($item)) {
            return null;
        }

        $caption = Arr::get($item, 'caption');

        if (!is_string($caption)) {
            return null;
        }

        $trimmed = trim($caption);

        return $trimmed !== '' ? $trimmed : null;
    }
}
