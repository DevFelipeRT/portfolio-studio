<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Domain\Models;

use App\Modules\Images\Domain\Models\Image;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Represents a portfolio initiative.
 *
 * An initiative can be a single date event or a period,
 * depending on the presence of an end date.
 */
class Initiative extends Model
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
        'display',
        'start_date',
        'end_date',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'display' => 'boolean',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    /**
     * Images associated with the initiative.
     *
     * @return BelongsToMany<Image>
     */
    public function images(): BelongsToMany
    {
        return $this
            ->belongsToMany(Image::class, 'initiative_images')
            ->withPivot([
                'position',
                'is_cover',
                'caption',
            ])
            ->withTimestamps();
    }
}
