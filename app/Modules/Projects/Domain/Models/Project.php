<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Models;

use App\Modules\Images\Domain\Models\Image;
use App\Modules\Technologies\Domain\Models\Technology;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Represents a portfolio project.
 */
class Project extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'name',
        'short_description',
        'long_description',
        'status',
        'repository_url',
        'live_url',
        'display',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
    ];

    /**
     * Images associated with the project.
     *
     * @return BelongsToMany<Image>
     */
    public function images(): BelongsToMany
    {
        return $this
            ->belongsToMany(Image::class, 'project_images')
            ->withPivot([
                'position',
                'is_cover',
                'caption',
            ])
            ->withTimestamps();
    }

    /**
     * Technologies used in the project.
     *
     * @return BelongsToMany<Technology>
     */
    public function technologies(): BelongsToMany
    {
        return $this
            ->belongsToMany(Technology::class)
            ->withTimestamps();
    }
}
