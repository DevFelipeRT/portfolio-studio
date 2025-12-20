<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Capabilities\Dtos;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Technologies\Domain\Models\Technology;
use Illuminate\Support\Collection;

/**
 * Data transfer object for a public visible project.
 */
final class VisibleProjectItem
{
    /**
     * @param VisibleProjectImageItem[] $images
     * @param array<int, array{id: int, name: string, category: string}> $technologies
     */
    public function __construct(
        private readonly int $id,
        private readonly string $name,
        private readonly ?string $shortDescription,
        private readonly ?string $longDescription,
        private readonly ?string $repositoryUrl,
        private readonly ?string $liveUrl,
        private readonly bool $display,
        private readonly array $images,
        private readonly array $technologies,
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

        $technologyDtos = $project->technologies
            ->map(
                static function (Technology $technology): array {
                    return [
                        'id' => $technology->id,
                        'name' => $technology->name,
                        'category' => $technology->category,
                    ];
                }
            )
            ->values()
            ->all();

        return new self(
            $project->id,
            $project->name,
            $project->short_description,
            $project->long_description,
            $project->repository_url,
            $project->live_url,
            (bool) $project->display,
            $imageDtos,
            $technologyDtos,
        );
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     short_description: ?string,
     *     long_description: ?string,
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
     *     technologies: array<int, array{id: int, name: string, category: string}>
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'short_description' => $this->shortDescription,
            'long_description' => $this->longDescription,
            'repository_url' => $this->repositoryUrl,
            'live_url' => $this->liveUrl,
            'display' => $this->display,
            'images' => \array_map(
                static fn(VisibleProjectImageItem $image): array => $image->toArray(),
                $this->images,
            ),
            'technologies' => $this->technologies,
        ];
    }
}
