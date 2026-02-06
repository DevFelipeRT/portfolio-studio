<?php

declare(strict_types=1);

namespace App\Modules\Projects\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Mapping\Mapper;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Skills\Domain\Models\Skill;

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
            'locale' => $project->locale,
            'name' => $project->name,
            'summary' => $project->summary,
            'description' => $project->description,
            'status' => $project->status,
            'repository_url' => $project->repository_url,
            'live_url' => $project->live_url,
            'display' => $project->display,
            'created_at' => self::formatDate($project->created_at),
            'updated_at' => self::formatDate($project->updated_at),

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

            'skills' => $project->skills
                ->map(
                    static function (Skill $skill): array {
                        return [
                            'id' => $skill->id,
                            'name' => $skill->name,
                            'category' => $skill->category,
                            'skill_category_id' => $skill->skill_category_id,
                        ];
                    }
                )
                ->values()
                ->all(),
        ];
    }
}
