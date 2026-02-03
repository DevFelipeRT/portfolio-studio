<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Capabilities\Dtos;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Support\Collection;

/**
 * Data transfer object for a public visible project.
 */
final class VisibleProjectItem
{
    /**
     * @param VisibleProjectImageItem[] $images
     * @param array<int, array{
     *     id: int,
     *     name: string,
     *     category: ?array{id: int, name: string, slug: string},
     *     skill_category_id: ?int
     * }> $skills
     */
    public function __construct(
        private readonly int $id,
        private readonly string $name,
        private readonly ?string $summary,
        private readonly ?string $description,
        private readonly ?string $repositoryUrl,
        private readonly ?string $liveUrl,
        private readonly bool $display,
        private readonly array $images,
        private readonly array $skills,
    ) {
    }

    public static function fromModel(Project $project): self
    {
        /** @var Collection<int,Image> $images */
        $images = $project->images instanceof Collection
            ? $project->images
            : collect();

        $imageDtos = $images
            ->map(
                static function (Image $image): VisibleProjectImageItem {
                    return VisibleProjectImageItem::fromModel($image);
                }
            )
            ->values()
            ->all();

        $skillDtos = $project->skills
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
            ->all();

        return new self(
            $project->id,
            $project->name,
            $project->summary,
            $project->description,
            $project->repository_url,
            $project->live_url,
            (bool) $project->display,
            $imageDtos,
            $skillDtos,
        );
    }

    public static function fromModelWithTranslations(
        Project $project,
        string $name,
        ?string $summary,
        ?string $description,
        ?string $repositoryUrl,
        ?string $liveUrl,
    ): self {
        /** @var Collection<int,Image> $images */
        $images = $project->images instanceof Collection
            ? $project->images
            : collect();

        $imageDtos = $images
            ->map(
                static function (Image $image): VisibleProjectImageItem {
                    return VisibleProjectImageItem::fromModel($image);
                }
            )
            ->values()
            ->all();

        $skillDtos = $project->skills
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
            ->all();

        return new self(
            $project->id,
            $name,
            $summary,
            $description,
            $repositoryUrl,
            $liveUrl,
            (bool) $project->display,
            $imageDtos,
            $skillDtos,
        );
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     summary: ?string,
     *     description: ?string,
     *     repository_url: ?string,
     *     live_url: ?string,
     *     display: bool,
     *     images: array<int, array{
     *         id: int,
     *         url: string,
     *         alt: ?string,
     *         title: ?string,
     *         caption: ?string,
     *         position: ?int,
     *         is_cover: bool,
     *         owner_caption: ?string
     *     }>,
     *     skills: array<int, array{
     *         id: int,
     *         name: string,
     *         category: ?array{id: int, name: string, slug: string},
     *         skill_category_id: ?int
     *     }>
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'summary' => $this->summary,
            'description' => $this->description,
            'repository_url' => $this->repositoryUrl,
            'live_url' => $this->liveUrl,
            'display' => $this->display,
            'images' => \array_map(
                static fn(VisibleProjectImageItem $image): array => $image->toArray(),
                $this->images,
            ),
            'skills' => $this->skills,
        ];
    }
}
