<?php

declare(strict_types=1);

namespace App\Modules\Images\Application\Services;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Service responsible for managing image records and stored files.
 */
final class ImageService
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
        $this->applySafeAttributes($image, $attributes);

        $image->save();

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
        $disk = $this->resolveAllowedDisk(self::DISK_PUBLIC);

        $dimensions = $this->extractImageDimensions($file);
        $storagePath = $file->store($directory, $disk);

        try {
            return DB::transaction(function () use ($disk, $storagePath, $file, $dimensions, $imageAttributes): Image {
                $image = new Image();

                $image->storage_disk = $disk;
                $image->storage_path = $storagePath;
                $image->mime_type = $this->resolveMimeType($file);
                $image->file_size_bytes = $file->getSize();
                $image->image_width = $dimensions['width'];
                $image->image_height = $dimensions['height'];
                $image->original_filename = (string) $file->getClientOriginalName();

                $this->applySafeAttributes($image, $imageAttributes);

                $image->save();

                return $image;
            });
        } catch (\Throwable $e) {
            Storage::disk($disk)->delete($storagePath);

            throw $e;
        }
    }

    /**
     * Replace the stored file associated with an image.
     */
    public function replaceFile(Image $image, UploadedFile $file, string $directory): void
    {
        $oldDisk = (\is_string($image->storage_disk) && $image->storage_disk !== '')
            ? $image->storage_disk
            : null;

        $oldPath = (\is_string($image->storage_path) && $image->storage_path !== '')
            ? $image->storage_path
            : null;

        $currentDisk = (\is_string($image->storage_disk) && $image->storage_disk !== '')
            ? $image->storage_disk
            : self::DISK_PUBLIC;

        $disk = $this->resolveAllowedDisk($currentDisk);

        $dimensions = $this->extractImageDimensions($file);
        $newPath = $file->store($directory, $disk);

        try {
            DB::transaction(function () use ($image, $disk, $newPath, $file, $dimensions): void {
                $image->storage_disk = $disk;
                $image->storage_path = $newPath;
                $image->mime_type = $this->resolveMimeType($file);
                $image->file_size_bytes = $file->getSize();
                $image->image_width = $dimensions['width'];
                $image->image_height = $dimensions['height'];
                $image->original_filename = (string) $file->getClientOriginalName();

                $image->save();
            });
        } catch (\Throwable $e) {
            Storage::disk($disk)->delete($newPath);

            throw $e;
        }

        if (\is_string($oldDisk) && $oldDisk !== '' && \is_string($oldPath) && $oldPath !== '') {
            $resolvedOldDisk = $this->resolveAllowedDisk($oldDisk);

            Storage::disk($resolvedOldDisk)->delete($oldPath);
        }
    }

    private function deleteStoredFile(Image $image): void
    {
        $path = (\is_string($image->storage_path) && $image->storage_path !== '')
            ? $image->storage_path
            : null;

        if ($path === null) {
            return;
        }

        $currentDisk = (\is_string($image->storage_disk) && $image->storage_disk !== '')
            ? $image->storage_disk
            : self::DISK_PUBLIC;

        $disk = $this->resolveAllowedDisk($currentDisk);

        Storage::disk($disk)->delete($path);
    }

    /**
     * @param array<string,mixed> $attributes
     */
    private function applySafeAttributes(Image $image, array $attributes): void
    {
        $allowed = [
            'image_title',
            'alt_text',
            'caption',
        ];

        foreach ($allowed as $key) {
            if (!\array_key_exists($key, $attributes)) {
                continue;
            }

            $value = $attributes[$key];

            if ($value === null || \is_scalar($value)) {
                $image->{$key} = $value;
            }
        }
    }

    private function resolveAllowedDisk(string $candidate): string
    {
        $candidate = \trim($candidate);

        $allowed = config('images.allowed_disks');

        if (\is_array($allowed) && \in_array($candidate, $allowed, true)) {
            return $candidate;
        }

        return self::DISK_PUBLIC;
    }

    /**
     * @return array{width:int|null,height:int|null}
     */
    private function extractImageDimensions(UploadedFile $file): array
    {
        $realPath = $file->getRealPath();

        if (!\is_string($realPath) || $realPath === '') {
            return ['width' => null, 'height' => null];
        }

        $dimensions = @\getimagesize($realPath);

        if (!\is_array($dimensions)) {
            return ['width' => null, 'height' => null];
        }

        $width = isset($dimensions[0]) && \is_int($dimensions[0]) ? $dimensions[0] : null;
        $height = isset($dimensions[1]) && \is_int($dimensions[1]) ? $dimensions[1] : null;

        return ['width' => $width, 'height' => $height];
    }

    private function resolveMimeType(UploadedFile $file): string
    {
        $serverMime = $file->getMimeType();

        if (\is_string($serverMime) && $serverMime !== '') {
            return $serverMime;
        }

        return (string) $file->getClientMimeType();
    }
}
