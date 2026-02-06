<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a localized project content set.
 *
 * @property int $id
 * @property int $project_id
 * @property string $locale
 * @property string|null $name
 * @property string|null $summary
 * @property string|null $description
 * @property string|null $status
 * @property string|null $repository_url
 * @property string|null $live_url
 */
class ProjectTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'project_id',
        'locale',
        'name',
        'summary',
        'description',
        'status',
        'repository_url',
        'live_url',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'project_id' => 'integer',
    ];

    /**
     * Project that owns this translation.
     *
     * @return BelongsTo<Project,ProjectTranslation>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
