<?php

declare(strict_types=1);

namespace App\Modules\Technologies\Domain\Models;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Technologies\Domain\Enums\TechnologyCategories;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Represents a reusable technology in the portfolio.
 *
 * @property int                     $id
 * @property string                  $name
 * @property TechnologyCategories    $category
 */
class Technology extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'name',
        'category',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,mixed>
     */
    protected $casts = [
        'id'       => 'integer',
        'category' => TechnologyCategories::class,
    ];

    /**
     * Projects that use this technology.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)->withTimestamps();
    }
}
