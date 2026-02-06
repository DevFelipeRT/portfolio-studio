<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a localized contact channel label.
 *
 * @property int $id
 * @property int $contact_channel_id
 * @property string $locale
 * @property string|null $label
 */
class ContactChannelTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'contact_channel_id',
        'locale',
        'label',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'contact_channel_id' => 'integer',
    ];

    /**
     * Contact channel owning this translation.
     *
     * @return BelongsTo<ContactChannel,ContactChannelTranslation>
     */
    public function contactChannel(): BelongsTo
    {
        return $this->belongsTo(ContactChannel::class, 'contact_channel_id');
    }
}
