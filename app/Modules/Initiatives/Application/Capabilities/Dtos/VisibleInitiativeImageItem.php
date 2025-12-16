<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Capabilities\Dtos;

use App\Modules\Images\Domain\Models\Image;

/**
 * Data transfer object for a public initiative image with pivot metadata.
 */
final class VisibleInitiativeImageItem
{
    public function __construct(
        private readonly int $id,
        private readonly string $url,
        private readonly ?string $alt,
        private readonly ?string $title,
        private readonly ?string $caption,
        private readonly ?int $position,
        private readonly bool $isCover,
        private readonly ?string $ownerCaption,
    ) {
    }

    public static function fromModel(Image $image): self
    {
        /** @var object|null $pivot */
        $pivot = $image->pivot ?? null;

        return new self(
            $image->id,
            $image->url,
            $image->alt_text,
            $image->image_title,
            $image->caption,
            $pivot?->position ?? null,
            (bool) ($pivot->is_cover ?? false),
            $pivot?->caption ?? null,
        );
    }

    /**
     * @return array{
     *     id: int,
     *     url: string,
     *     alt: ?string,
     *     title: ?string,
     *     caption: ?string,
     *     position: ?int,
     *     is_cover: bool,
     *     owner_caption: ?string
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'url' => $this->url,
            'alt' => $this->alt,
            'title' => $this->title,
            'caption' => $this->caption,
            'position' => $this->position,
            'is_cover' => $this->isCover,
            'owner_caption' => $this->ownerCaption,
        ];
    }
}
