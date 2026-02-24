<?php

declare(strict_types=1);

namespace App\Modules\Images\Http\Mappers;

use App\Modules\Images\Domain\Models\Image;

/**
 * Maps transport-layer input (e.g. session flashed "old input") into the shape
 * expected by the Inertia image form pages.
 */
final class ImageFormMapper
{
    /**
     * @param array<string, mixed> $oldInput
     * @return array{
     *   file: null,
     *   alt_text: string,
     *   image_title: string,
     *   caption: string
     * }
     */
    public static function fromEdit(Image $image, array $oldInput): array
    {
        return [
            'file' => null,
            'alt_text' => (string) ($oldInput['alt_text'] ?? $image->alt_text ?? ''),
            'image_title' => (string) ($oldInput['image_title'] ?? $image->image_title ?? ''),
            'caption' => (string) ($oldInput['caption'] ?? $image->caption ?? ''),
        ];
    }
}
