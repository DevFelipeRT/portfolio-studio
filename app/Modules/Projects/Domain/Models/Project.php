<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Models;

use App\Modules\Images\Domain\Models\Image;
use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * Eloquent model representing a portfolio project.
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
        'display' => 'boolean',
    ];

    /**
     * Images associated with the project.
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
     * Skills associated with the project.
     *
     * Pivot table: project_skill
     *
     * @return BelongsToMany<Skill>
     */
    public function skills(): BelongsToMany
    {
        return $this
            ->belongsToMany(
                Skill::class,
                'project_skill',
                'project_id',
                'skill_id',
            )
            ->withTimestamps();
    }
}
