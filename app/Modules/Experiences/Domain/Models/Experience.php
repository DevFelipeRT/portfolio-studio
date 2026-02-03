<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Experience extends Model
{
    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'locale',
        'position',
        'company',
        'summary',
        'description',
        'start_date',
        'end_date',
        'display',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    /**
     * Localized experience content.
     *
     * @return HasMany<ExperienceTranslation>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ExperienceTranslation::class, 'experience_id');
    }
}
