<?php

declare(strict_types=1);

namespace App\Modules\Images\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/**
 * Eloquent model representing a stored image resource.
 */
class Image extends Model
{
    use HasFactory;

    /**
     * Attachments that reference this image.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(ImageAttachment::class);
    }

    /**
     * Get the public URL for the stored image.
     *
     * @return string
     */
    public function getUrlAttribute(): string
    {
        $diskName = $this->storage_disk ?: config('filesystems.default');

        /** @var \Illuminate\Contracts\Filesystem\Cloud $disk */
        $disk = Storage::disk($diskName);

        return $disk->url($this->storage_path);
    }
}
