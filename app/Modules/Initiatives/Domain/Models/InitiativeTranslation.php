<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a localized initiative content set.
 *
 * @property int $id
 * @property int $initiative_id
 * @property string $locale
 * @property string|null $name
 * @property string|null $summary
 * @property string|null $description
 */
class InitiativeTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'initiative_id',
        'locale',
        'name',
        'summary',
        'description',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'initiative_id' => 'integer',
    ];

    /**
     * Initiative that owns this translation.
     *
     * @return BelongsTo<Initiative,InitiativeTranslation>
     */
    public function initiative(): BelongsTo
    {
        return $this->belongsTo(Initiative::class, 'initiative_id');
    }
}
