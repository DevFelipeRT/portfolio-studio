<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Mapping\Mapper;
use App\Modules\Experiences\Domain\Models\Experience;

final class ExperienceMapper extends Mapper
{
    protected static string $modelClass = Experience::class;

    protected static function map(mixed $model): array
    {
        /** @var Experience $experience */
        $experience = $model;

        return [
            'id' => $experience->id,
            'position' => $experience->position,
            'company' => $experience->company,
            'summary' => $experience->summary,
            'description' => $experience->description,
            'start_date' => self::formatDate($experience->start_date),
            'end_date' => self::formatDate($experience->end_date),
            'display' => $experience->display,
        ];
    }
}
