<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Capabilities\Dtos;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Images\Domain\Models\Image;
use Illuminate\Support\Collection;

/**
 * Data transfer object for a public visible initiative.
 */
final class VisibleInitiativeItem
{
    /**
     * @param VisibleInitiativeImageItem[] $images
     */
    public function __construct(
        private readonly int $id,
        private readonly string $name,
        private readonly ?string $summary,
        private readonly ?string $description,
        private readonly bool $display,
        private readonly ?string $startDate,
        private readonly ?string $endDate,
        private readonly array $images,
    ) {
    }

    public static function fromModel(Initiative $initiative): self
    {
        return self::fromModelWithTranslations(
            $initiative,
            $initiative->name,
            $initiative->summary,
            $initiative->description,
        );
    }

    public static function fromModelWithTranslations(
        Initiative $initiative,
        string $name,
        ?string $summary,
        ?string $description,
    ): self
    {
        /** @var Collection<int,Image> $images */
        $images = $initiative->images ?? collect();

        $imageDtos = $images
            ->sortBy(
                static function (Image $image): int {
                    /** @var object|null $pivot */
                    $pivot = $image->pivot ?? null;

                    return (int) ($pivot->position ?? 0);
                }
            )
            ->values()
            ->map(
                static function (Image $image): VisibleInitiativeImageItem {
                    return VisibleInitiativeImageItem::fromModel($image);
                }
            )
            ->all();

        return new self(
            $initiative->id,
            $name,
            $summary,
            $description,
            (bool) $initiative->display,
            $initiative->start_date !== null ? (string) $initiative->start_date : null,
            $initiative->end_date !== null ? (string) $initiative->end_date : null,
            $imageDtos,
        );
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     summary: ?string,
     *     description: ?string,
     *     display: bool,
     *     start_date: ?string,
     *     end_date: ?string,
     *     images: array<int, array{
     *         id: int,
     *         url: string,
     *         alt: ?string,
     *         title: ?string,
     *         caption: ?string,
     *         position: ?int,
     *         is_cover: bool,
     *         owner_caption: ?string
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
            'display' => $this->display,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'images' => \array_map(
                static fn(VisibleInitiativeImageItem $image): array => $image->toArray(),
                $this->images,
            ),
        ];
    }
}
