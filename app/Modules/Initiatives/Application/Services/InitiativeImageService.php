<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Services;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Images\Application\Services\ImageService;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection as SupportCollection;

/**
 * Domain service for managing images associated with initiatives.
 */
class InitiativeImageService
{
    private const DIRECTORY = 'initiatives';
    private const TABLE = 'image_attachments';
    private const ORDER_BY = 'position';


    public function __construct(
        private readonly ImageService $imageService,
    ) {
    }

    /**
     * List images associated with an initiative ordered by pivot position.
     *
     * @return EloquentCollection<int,Image>
     */
    public function list(Initiative $initiative): EloquentCollection
    {
        /** @var EloquentCollection<int,Image> $images */
        $images = $initiative
            ->images()
            ->orderBy(self::TABLE . '.'. self::ORDER_BY)
            ->get();

        return $images;
    }

    /**
     * Attach a new uploaded image to an initiative.
     *
     * @param array<string,mixed> $attributes
     */
    public function add(Initiative $initiative, array $attributes): Image
    {
        $file = $this->extractUploadedFile($attributes);
        [$alt, $title, $caption] = $this->extractTextMetadata($attributes, null);

        $image = $this->imageService->createFromUploadedFile(
            file: $file,
            directory: self::DIRECTORY,
            imageAttributes: [
                'alt_text' => $alt,
                'image_title' => $title,
                'caption' => $caption,
            ],
        );

        $initiative->images()->attach($image->id, [
            'position' => 0,
            'is_cover' => false,
            'caption' => $caption,
        ]);

        return $image;
    }

    /**
     * Update an image associated with an initiative.
     *
     * @param array<string,mixed> $attributes
     */
    public function update(Initiative $initiative, Image $image, array $attributes): Image
    {
        $file = $attributes['file'] ?? null;

        if ($file instanceof UploadedFile) {
            $this->imageService->replaceFile(
                image: $image,
                file: $file,
                directory: self::DIRECTORY,
            );
        }

        [$alt, $title, $caption] = $this->extractTextMetadata($attributes, $image);

        $image->alt_text = $alt;
        $image->image_title = $title;
        $image->caption = $caption;
        $image->save();

        $initiative->images()->updateExistingPivot($image->id, [
            'caption' => $caption,
        ]);

        return $image;
    }

    /**
     * Replace all images of an initiative with the given collection.
     *
     * @param array<int,array<string,mixed>> $images
     * @return SupportCollection<int,Image>
     */
    public function replace(Initiative $initiative, array $images): SupportCollection
    {
        /** @var EloquentCollection<int,Image> $existing */
        $existing = $initiative->images()->get();

        foreach ($existing as $image) {
            $initiative->images()->detach($image->id);
            $this->imageService->deleteIfOrphan($image);
        }

        if ($images === []) {
            /** @var SupportCollection<int,Image> */
            return collect();
        }

        /** @var SupportCollection<int,Image> $created */
        $created = collect();
        $position = 0;

        foreach ($images as $attributes) {
            $image = $this->add($initiative, $attributes);

            $initiative->images()->updateExistingPivot($image->id, [
                'position' => $position,
            ]);

            $created->push($image);
            $position++;
        }

        return $created;
    }

    /**
     * Detach an image from an initiative and delete it when it becomes orphaned.
     */
    public function detach(Initiative $initiative, Image $image): void
    {
        $initiative->images()->detach($image->id);

        $this->imageService->deleteIfOrphan($image);
    }

    /**
     * Extract and validate an uploaded file from attributes.
     *
     * @param array<string,mixed> $attributes
     */
    private function extractUploadedFile(array $attributes): UploadedFile
    {
        $file = $attributes['file'] ?? null;

        if (!$file instanceof UploadedFile) {
            throw new \InvalidArgumentException('The "file" attribute must be an instance of UploadedFile.');
        }

        return $file;
    }

    /**
     * Extract text metadata (alt, title, caption) from attributes.
     *
     * When a fallback image is provided, missing values are taken from it.
     *
     * @param array<string,mixed> $attributes
     * @return array{0:?string,1:?string,2:?string}
     */
    private function extractTextMetadata(array $attributes, ?Image $fallback): array
    {
        $alt = $attributes['alt'] ?? $fallback?->alt_text;
        $title = $attributes['title'] ?? $fallback?->image_title;

        $caption = $attributes['caption']
            ?? $fallback?->caption
            ?? $alt;

        return [$alt, $title, $caption];
    }
}
