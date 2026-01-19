<?php

declare(strict_types=1);

namespace App\Modules\Skills\Domain\Models;

use App\Modules\Projects\Domain\Models\Project;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Represents a reusable skill in the portfolio.
 *
 * @property int         $id
 * @property string      $name
 * @property int|null    $skill_category_id
 */
class Skill extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'name',
        'skill_category_id',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,mixed>
     */
    protected $casts = [
        'id' => 'integer',
        'skill_category_id' => 'integer',
    ];

    /**
     * Category assigned to this skill.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(SkillCategory::class, 'skill_category_id');
    }

    /**
     * Projects that use this skill.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)->withTimestamps();
    }
}
