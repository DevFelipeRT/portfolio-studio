<?php

declare(strict_types=1);

namespace App\Modules\Images\Application\Services;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Manages image records and their stored files.
 */
final class ImageService
{
    private const DISK_PUBLIC = 'public';

    /**
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

    public function replaceFile(Image $image, UploadedFile $file, string $directory): void
    {
        $currentDisk = (\is_string($image->storage_disk) && $image->storage_disk !== '')
            ? $image->storage_disk
            : self::DISK_PUBLIC;

        $disk = $this->resolveAllowedDisk($currentDisk);

        $oldDisk = (\is_string($image->storage_disk) && $image->storage_disk !== '')
            ? $image->storage_disk
            : null;

        $oldPath = (\is_string($image->storage_path) && $image->storage_path !== '')
            ? $image->storage_path
            : null;

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

    public function deleteCompletely(Image $image): void
    {
        $this->deleteStoredFile($image);

        $image->delete();
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
