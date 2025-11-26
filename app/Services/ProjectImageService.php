<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

/**
 * Service responsible for managing images associated with projects.
 */
class ProjectImageService
{
    /**
     * List images for a given project.
     *
     * @return Collection<int,ProjectImage>
     */
    public function listBy(Project $project): Collection
    {
        return $project->images()
            ->orderBy('id')
            ->get();
    }

    /**
     * Attach a new image to a project.
     *
     * Expects attributes containing an uploaded file and optional alt text.
     *
     * @param array<string,mixed> $attributes
     */
    public function addImage(Project $project, array $attributes): ProjectImage
    {
        $payload = $this->prepareAttributesForPersistence($attributes);

        return $project->images()->create($payload);
    }

    /**
     * Update an existing project image.
     *
     * If a new file is provided, the old file is deleted and replaced.
     *
     * @param array<string,mixed> $attributes
     */
    public function update(ProjectImage $image, array $attributes): ProjectImage
    {
        $payload = $this->prepareAttributesForPersistence($attributes, $image);

        $image->update($payload);

        return $image;
    }

    /**
     * Delete a project image and its stored file.
     */
    public function delete(ProjectImage $image): void
    {
        if ($image->src !== null) {
            Storage::disk('public')->delete($image->src);
        }

        $image->delete();
    }

    /**
     * Replace all images of a project with the given collection.
     *
     * Existing images have their files deleted before removal.
     *
     * @param array<int,array<string,mixed>> $images
     *
     * @return Collection<int,ProjectImage>
     */
    public function replaceImages(Project $project, array $images): Collection
    {
        $existing = $project->images()->get();

        foreach ($existing as $image) {
            $this->delete($image);
        }

        if (empty($images)) {
            /** @var Collection<int,ProjectImage> */
            return collect();
        }

        /** @var Collection<int,ProjectImage> $created */
        $created = collect();

        foreach ($images as $attributes) {
            $created->push($this->addImage($project, $attributes));
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
        ?ProjectImage $currentImage = null
    ): array {
        $payload = [];

        if (isset($attributes['file']) && $attributes['file'] instanceof UploadedFile) {
            if ($currentImage !== null && $currentImage->src !== null) {
                Storage::disk('public')->delete($currentImage->src);
            }

            $payload['src'] = $attributes['file']->store('projects', 'public');
        } elseif ($currentImage !== null && $currentImage->src !== null) {
            $payload['src'] = $currentImage->src;
        }

        if (\array_key_exists('alt', $attributes)) {
            $payload['alt'] = $attributes['alt'] ?? null;
        }

        return $payload;
    }
}
