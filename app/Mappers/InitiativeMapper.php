<?php

declare(strict_types=1);

namespace App\Mappers;

use App\Models\Initiative;
use App\Models\InitiativeImage;

final class InitiativeMapper extends Mapper
{
    protected static string $modelClass = Initiative::class;

    protected static function map(mixed $model): array
    {
        /** @var Initiative $initiative */
        $initiative = $model;

        return [
            'id' => $initiative->id,
            'name' => $initiative->name,
            'short_description' => $initiative->short_description,
            'long_description' => $initiative->long_description,
            'start_date' => self::formatDate($initiative->start_date),
            'end_date' => self::formatDate($initiative->end_date),
            'display' => $initiative->display,
            'images' => $initiative->images?->map(fn(InitiativeImage $image) => [
                'src' => $image->src,
                'alt' => $image->alt,
            ]),
        ];
    }
}
