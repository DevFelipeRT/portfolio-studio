<?php

declare(strict_types=1);

namespace App\Modules\Projects\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Mapping\Mapper;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Technologies\Domain\Models\Technology;

use Illuminate\Support\Collection;

final class ProjectMapper extends Mapper
{
    protected static string $modelClass = Project::class;

    /**
     * Map a Project model into an array suitable for frontend consumption.
     *
     * @param mixed $model
     * @return array<string,mixed>
     */
    protected static function map(mixed $model): array
    {
        /** @var Project $project */
        $project = $model;

        /** @var Collection<int,Image> $images */
        $images = $project->images instanceof Collection
            ? $project->images
            : collect();

        return [
            'id' => $project->id,
            'name' => $project->name,
            'short_description' => $project->short_description,
            'long_description' => $project->long_description,
            'repository_url' => $project->repository_url,
            'live_url' => $project->live_url,
            'display' => $project->display,

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

            'technologies' => $project->technologies
                ->map(
                    static function (Technology $tech): array {
                        return [
                            'id' => $tech->id,
                            'name' => $tech->name,
                            'category' => $tech->category,
                        ];
                    }
                )
                ->values()
                ->all(),
        ];
    }
}
