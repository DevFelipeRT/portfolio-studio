<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Domain\Models;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'locale',
        'name',
        'summary',
        'description',
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
     * Pivot table: image_attachments
     * Pivot fields: position, is_cover, caption
     *
     * @return MorphToMany<Image>
     */
    public function images(): MorphToMany
    {
        return $this
            ->morphToMany(
                Image::class,
                'owner',
                'image_attachments',
                'owner_id',
                'image_id',
            )
            ->withPivot([
                'position',
                'is_cover',
                'caption',
            ])
            ->withTimestamps();
    }

    /**
     * Localized initiative content.
     *
     * @return HasMany<InitiativeTranslation>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(InitiativeTranslation::class, 'initiative_id');
    }
}
