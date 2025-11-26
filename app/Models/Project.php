<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class);
    }

    /**
     * Technologies used in the project.
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class)->withTimestamps();
    }
}
