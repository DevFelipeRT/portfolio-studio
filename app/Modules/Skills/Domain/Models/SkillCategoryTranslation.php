<?php

declare(strict_types=1);

namespace App\Modules\Skills\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a localized skill category name.
 *
 * @property int $id
 * @property int $skill_category_id
 * @property string $locale
 * @property string $name
 */
class SkillCategoryTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'skill_category_id',
        'locale',
        'name',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'skill_category_id' => 'integer',
    ];

    /**
     * Category that owns this translation.
     *
     * @return BelongsTo<SkillCategory,SkillCategoryTranslation>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(SkillCategory::class, 'skill_category_id');
    }
}
