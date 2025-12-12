<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Base\Mapper;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Images\Domain\Models\Image;

use Illuminate\Support\Collection;

final class InitiativeMapper extends Mapper
{
    protected static string $modelClass = Initiative::class;

    /**
     * Map an Initiative model into an array suitable for frontend consumption.
     *
     * @param mixed $model
     * @return array<string,mixed>
     */
    protected static function map(mixed $model): array
    {
        /** @var Initiative $initiative */
        $initiative = $model;

        /** @var Collection<int,Image> $images */
        $images = $initiative->images instanceof Collection
            ? $initiative->images
            : collect();

        return [
            'id' => $initiative->id,
            'name' => $initiative->name,
            'short_description' => $initiative->short_description,
            'long_description' => $initiative->long_description,
            'start_date' => self::formatDate($initiative->start_date),
            'end_date' => self::formatDate($initiative->end_date),
            'display' => $initiative->display,

            'images' => self::mapRelatedWithPivot(
                $images,
                static fn(Image $image): array => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'alt' => $image->alt_text,
                    'title' => $image->image_title,
                    'caption' => $image->caption,
                ],
                static fn(?object $pivot): array => [
                    'position' => $pivot?->position,
                    'is_cover' => (bool) ($pivot->is_cover ?? false),
                    'owner_caption' => $pivot?->caption,
                ],
            ),
        ];
    }
}
