<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InitiativeImage extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'initiative_id',
        'src',
        'alt',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'initiative_id' => 'integer',
    ];

    /**
     * Related initiative.
     */
    public function initiative(): BelongsTo
    {
        return $this->belongsTo(Initiative::class);
    }
}
