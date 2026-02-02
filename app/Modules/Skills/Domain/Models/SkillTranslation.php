<?php

declare(strict_types=1);

namespace App\Modules\Skills\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a localized skill name.
 *
 * @property int $id
 * @property int $skill_id
 * @property string $locale
 * @property string $name
 */
class SkillTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'skill_id',
        'locale',
        'name',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'skill_id' => 'integer',
    ];

    /**
     * Skill that owns this translation.
     *
     * @return BelongsTo<Skill,SkillTranslation>
     */
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class, 'skill_id');
    }
}
