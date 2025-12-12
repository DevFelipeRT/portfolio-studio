<?php

declare(strict_types=1);

namespace App\Modules\Images\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Base\Mapper;
use App\Modules\Images\Domain\Models\Image;

final class ImageMapper extends Mapper
{
    /**
     * Fully qualified model class this mapper handles.
     *
     * @var class-string
     */
    protected static string $modelClass = Image::class;

    /**
     * Map an Image model into an array suitable for frontend consumption.
     *
     * This representation is domain-agnostic and does not include pivot data.
     *
     * @param mixed $model
     * @return array<string,mixed>
     */
    protected static function map(mixed $model): array
    {
        /** @var Image $image */
        $image = $model;

        return [
            'id' => $image->id,

            // Resolved URL
            'url' => $image->url,

            // Presentation metadata (aligned with frontend Image type)
            'alt_text' => $image->alt_text,
            'image_title' => $image->image_title,
            'caption' => $image->caption,

            // File metadata
            'mime_type' => $image->mime_type,
            'file_size_bytes' => $image->file_size_bytes,
            'image_width' => $image->image_width,
            'image_height' => $image->image_height,

            // Storage metadata
            'original_filename' => $image->original_filename,
            'storage_disk' => $image->storage_disk,
            'storage_path' => $image->storage_path,

            // Timestamps (same shape as HasTimestamps)
            'created_at' => self::formatDate($image->created_at),
            'updated_at' => self::formatDate($image->updated_at),
        ];
    }
}
