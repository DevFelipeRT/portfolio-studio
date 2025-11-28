<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Initiative;
use App\Models\InitiativeImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

/**
 * Service responsible for managing images associated with initiatives.
 */
class InitiativeImageService
{
    /**
     * List images for a given initiative.
     *
     * @return Collection<int,InitiativeImage>
     */
    public function listBy(Initiative $initiative): Collection
    {
        return $initiative->images()
            ->orderBy('id')
            ->get();
    }

    /**
     * Attach a new image to an initiative.
     *
     * Expects attributes containing an uploaded file and optional alt text.
     *
     * @param array<string,mixed> $attributes
     */
    public function addImage(Initiative $initiative, array $attributes): InitiativeImage
    {
        $payload = $this->prepareAttributesForPersistence($attributes);

        return $initiative->images()->create($payload);
    }

    /**
     * Update an existing initiative image.
     *
     * If a new file is provided, the old file is deleted and replaced.
     *
     * @param array<string,mixed> $attributes
     */
    public function update(InitiativeImage $image, array $attributes): InitiativeImage
    {
        $payload = $this->prepareAttributesForPersistence($attributes, $image);

        $image->update($payload);

        return $image;
    }

    /**
     * Delete an initiative image and its stored file.
     */
    public function delete(InitiativeImage $image): void
    {
        if ($image->src !== null) {
            Storage::disk('public')->delete($image->src);
        }

        $image->delete();
    }

    /**
     * Replace all images of an initiative with the given collection.
     *
     * Existing images have their files deleted before removal.
     *
     * @param array<int,array<string,mixed>> $images
     *
     * @return Collection<int,InitiativeImage>
     */
    public function replaceImages(Initiative $initiative, array $images): Collection
    {
        $existing = $initiative->images()->get();

        foreach ($existing as $image) {
            $this->delete($image);
        }

        if (empty($images)) {
            /** @var Collection<int,InitiativeImage> */
            return collect();
        }

        /** @var Collection<int,InitiativeImage> $created */
        $created = collect();

        foreach ($images as $attributes) {
            $created->push($this->addImage($initiative, $attributes));
        }

        return $created;
    }

    /**
     * Prepare attributes for persistence, handling file storage and alt text.
     *
     * @param array<string,mixed> $attributes
     * @return array<string,mixed>
     */
    private function prepareAttributesForPersistence(
        array $attributes,
        ?InitiativeImage $currentImage = null
    ): array {
        $payload = [];

        if (isset($attributes['file']) && $attributes['file'] instanceof UploadedFile) {
            if ($currentImage !== null && $currentImage->src !== null) {
                Storage::disk('public')->delete($currentImage->src);
            }

            $payload['src'] = $attributes['file']->store('initiatives', 'public');
        } elseif ($currentImage !== null && $currentImage->src !== null) {
            $payload['src'] = $currentImage->src;
        }

        if (\array_key_exists('alt', $attributes)) {
            $payload['alt'] = $attributes['alt'] ?? null;
        }

        return $payload;
    }
}
