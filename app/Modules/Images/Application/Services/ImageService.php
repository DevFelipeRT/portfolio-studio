<?php

declare(strict_types=1);

namespace App\Modules\Images\Application\Services;

use App\Modules\Images\Domain\Models\Image;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Infrastructure service for managing image records and stored files.
 *
 * This service provides global operations (admin listing, metadata update,
 * full deletion) and low-level file handling.
 */
class ImageService
{
    private const DISK_PUBLIC = 'public';

    /**
     * Paginate images with optional filters.
     *
     * Supported filters:
     * - search        : string|null
     * - usage         : "orphans"|"projects"|"initiatives"|null
     * - mime_type     : string|null
     * - storage_disk  : string|null
     *
     * @param array<string,mixed> $filters
     */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = Image::query()
            ->withCount(['projects', 'initiatives']);

        $search = $filters['search'] ?? null;
        if (\is_string($search) && $search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('original_filename', 'like', '%' . $search . '%')
                    ->orWhere('image_title', 'like', '%' . $search . '%')
                    ->orWhere('alt_text', 'like', '%' . $search . '%')
                    ->orWhere('caption', 'like', '%' . $search . '%');
            });
        }

        $usage = $filters['usage'] ?? null;
        if ($usage === 'orphans') {
            $query->doesntHave('projects')->doesntHave('initiatives');
        } elseif ($usage === 'projects') {
            $query->whereHas('projects');
        } elseif ($usage === 'initiatives') {
            $query->whereHas('initiatives');
        }

        $mimeType = $filters['mime_type'] ?? null;
        if (\is_string($mimeType) && $mimeType !== '') {
            $query->where('mime_type', $mimeType);
        }

        $storageDisk = $filters['storage_disk'] ?? null;
        if (\is_string($storageDisk) && $storageDisk !== '') {
            $query->where('storage_disk', $storageDisk);
        }

        return $query
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    /**
     * Load the image with its project and initiative associations.
     */
    public function loadUsage(Image $image): Image
    {
        return $image->load([
            'projects' => static function ($query): void {
                $query->withPivot(['position', 'is_cover', 'caption']);
            },
            'initiatives' => static function ($query): void {
                $query->withPivot(['position', 'is_cover', 'caption']);
            },
        ]);
    }

    /**
     * Update global metadata for an image.
     *
     * @param array<string,mixed> $attributes
     */
    public function updateMetadata(Image $image, array $attributes): Image
    {
        $image->update($attributes);

        return $image;
    }

    /**
     * Delete an image and all its associations, regardless of usage.
     *
     * This operation detaches the image from projects and initiatives,
     * deletes the stored file when present and removes the Image record.
     */
    public function deleteCompletely(Image $image): void
    {
        $image->projects()->detach();
        $image->initiatives()->detach();

        $this->deleteStoredFile($image);

        $image->delete();
    }

    /**
     * Delete multiple images and their associations in a single operation.
     *
     * @param array<int,int> $ids
     */
    public function bulkDeleteCompletely(array $ids): void
    {
        /** @var EloquentCollection<int,Image> $images */
        $images = Image::query()
            ->whereIn('id', $ids)
            ->get();

        foreach ($images as $image) {
            $this->deleteCompletely($image);
        }
    }

    /**
     * Delete the Image and its stored file when it is no longer associated with any owner.
     */
    public function deleteIfOrphan(Image $image): void
    {
        $isUsedByProjects = $image->projects()->exists();
        $isUsedByInitiatives = $image->initiatives()->exists();

        if ($isUsedByProjects || $isUsedByInitiatives) {
            return;
        }

        $this->deleteStoredFile($image);

        $image->delete();
    }

    /**
     * Create a new Image record from an uploaded file and store the file.
     *
     * @param array<string,mixed> $imageAttributes
     */
    public function createFromUploadedFile(
        UploadedFile $file,
        string $directory,
        array $imageAttributes = []
    ): Image {
        $disk = self::DISK_PUBLIC;

        $dimensions = @\getimagesize($file->getRealPath());
        $width = \is_array($dimensions) ? ($dimensions[0] ?? null) : null;
        $height = \is_array($dimensions) ? ($dimensions[1] ?? null) : null;

        $storagePath = $file->store($directory, $disk);

        $data = [
            'storage_disk' => $disk,
            'storage_path' => $storagePath,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'file_size_bytes' => $file->getSize(),
            'image_width' => $width,
            'image_height' => $height,
            'alt_text' => null,
            'image_title' => null,
            'caption' => null,
        ];

        $data = \array_merge($data, $imageAttributes);

        return Image::create($data);
    }

    /**
     * Replace the stored file associated with an Image.
     */
    public function replaceFile(
        Image $image,
        UploadedFile $file,
        string $directory
    ): void {
        $this->deleteStoredFile($image);

        $disk = $image->storage_disk ?: self::DISK_PUBLIC;

        $dimensions = @\getimagesize($file->getRealPath());
        $width = \is_array($dimensions) ? ($dimensions[0] ?? null) : null;
        $height = \is_array($dimensions) ? ($dimensions[1] ?? null) : null;

        $storagePath = $file->store($directory, $disk);

        $image->storage_disk = $disk;
        $image->storage_path = $storagePath;
        $image->original_filename = $file->getClientOriginalName();
        $image->mime_type = $file->getClientMimeType();
        $image->file_size_bytes = $file->getSize();
        $image->image_width = $width;
        $image->image_height = $height;

        $image->save();
    }

    /**
     * Delete the stored file associated with the image, if any.
     */
    private function deleteStoredFile(Image $image): void
    {
        if ($image->storage_disk === null || $image->storage_path === null) {
            return;
        }

        Storage::disk($image->storage_disk)->delete($image->storage_path);
    }
}
