<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     */
    protected $fillable = [
        'project_id',
        'src',
        'alt',
    ];

    /**
     * Attribute casts.
     */
    protected $casts = [
        'id' => 'integer',
        'project_id' => 'integer',
    ];

    /**
     * Related project.
     */
    public function project()
    {
        return $this->belongsTo(Project::class)->withTimestamps();
    }
}
