<?php

declare(strict_types=1);

namespace App\Mappers;

use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\Technology;

final class ProjectMapper extends Mapper
{
    protected static string $modelClass = Project::class;

    protected static function map(mixed $model): array
    {
        /** @var Project $project */
        $project = $model;

        return [
            'id' => $project->id,
            'name' => $project->name,
            'short_description' => $project->short_description,
            'long_description' => $project->long_description,
            'repository_url' => $project->repository_url,
            'live_url' => $project->live_url,
            'images' => $project->images?->map(fn(ProjectImage $image) => [
                'src' => $image->src,
                'alt' => $image->alt,
            ]),
            'technologies' => $project->technologies->map(fn(Technology $tech) => [
                'id' => $tech->id,
                'name' => $tech->name,
                'category' => $tech->category,
            ]),
            'display' => $project->display,
        ];
    }
}
