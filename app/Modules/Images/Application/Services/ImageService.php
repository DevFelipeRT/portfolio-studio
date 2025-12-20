<?php

declare(strict_types=1);

namespace App\Modules\Images\Application\Services;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Service responsible for managing image records and stored files.
 */
class ImageService
{
    private const DISK_PUBLIC = 'public';

    /**
     * Paginate images with optional filters.
     *
     * Supported filters:
     * - search       : string|null  (matches filename, title, alt text or caption)
     * - usage        : string|null  ("orphans"|"used")
     * - owner_type   : string|null  (attachment owner type, FQCN or morph alias)
     * - mime_type    : string|null
     * - storage_disk : string|null
     *
     * @param array<string,mixed> $filters
     */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = Image::query()
            ->withCount('attachments');

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
            $query->doesntHave('attachments');
        } elseif ($usage === 'used') {
            $query->has('attachments');
        }

        $ownerType = $filters['owner_type'] ?? null;
        if (\is_string($ownerType) && $ownerType !== '') {
            $query->whereHas('attachments', static function ($q) use ($ownerType): void {
                $q->where('owner_type', $ownerType);
            });
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
     * Load the image with its attachments ordered by position.
     */
    public function loadUsage(Image $image): Image
    {
        return $image->load([
            'attachments' => static function ($query): void {
                $query->orderBy('position');
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
     * Delete an image and all its attachments.
     */
    public function deleteCompletely(Image $image): void
    {
        $image->attachments()->delete();

        $this->deleteStoredFile($image);

        $image->delete();
    }

    /**
     * Delete multiple images and their attachments in a single operation.
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
     * Delete the image when it has no attachments.
     */
    public function deleteIfOrphan(Image $image): void
    {
        $hasAttachments = $image->attachments()->exists();

        if ($hasAttachments) {
            return;
        }

        $this->deleteStoredFile($image);

        $image->delete();
    }

    /**
     * Create a new image record from an uploaded file and store the file.
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
            'mime_type' => $file->getClientMimeType(),
            'file_size_bytes' => $file->getSize(),
            'image_width' => $width,
            'image_height' => $height,
            'original_filename' => $file->getClientOriginalName(),
        ];

        $data = \array_merge($data, $imageAttributes);

        return Image::create($data);
    }

    /**
     * Replace the stored file associated with an image.
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
        $image->mime_type = $file->getClientMimeType();
        $image->file_size_bytes = $file->getSize();
        $image->image_width = $width;
        $image->image_height = $height;

        $image->save();
    }

    /**
     * Delete the stored file associated with the image when present.
     */
    private function deleteStoredFile(Image $image): void
    {
        if ($image->storage_disk === null || $image->storage_path === null) {
            return;
        }

        Storage::disk($image->storage_disk)->delete($image->storage_path);
    }
}
