<?php

declare(strict_types=1);

namespace App\Modules\Images\Domain\Models;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Initiatives\Domain\Models\Initiative;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

/**
 * Eloquent model representing a stored image resource.
 */
class Image extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'images';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'storage_disk',
        'storage_path',
        'original_filename',
        'mime_type',
        'file_size_bytes',
        'image_width',
        'image_height',
        'alt_text',
        'image_title',
        'caption',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_size_bytes' => 'int',
        'image_width' => 'int',
        'image_height' => 'int',
    ];

    /**
     * Projects that use this image.
     *
     * @return BelongsToMany<Project>
     */
    public function projects(): BelongsToMany
    {
        return $this
            ->belongsToMany(Project::class, 'project_images')
            ->withPivot([
                'position',
                'is_cover',
                'caption',
            ])
            ->withTimestamps();
    }

    /**
     * Initiatives that use this image.
     *
     * @return BelongsToMany<Initiative>
     */
    public function initiatives(): BelongsToMany
    {
        return $this
            ->belongsToMany(Initiative::class, 'initiative_images')
            ->withPivot([
                'position',
                'is_cover',
                'caption',
            ])
            ->withTimestamps();
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
