<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a localized experience content set.
 *
 * @property int $id
 * @property int $experience_id
 * @property string $locale
 * @property string|null $position
 * @property string|null $company
 * @property string|null $summary
 * @property string|null $description
 */
class ExperienceTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'experience_id',
        'locale',
        'position',
        'company',
        'summary',
        'description',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'experience_id' => 'integer',
    ];

    /**
     * Experience that owns this translation.
     *
     * @return BelongsTo<Experience,ExperienceTranslation>
     */
    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class, 'experience_id');
    }
}
