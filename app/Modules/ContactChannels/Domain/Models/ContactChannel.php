<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Domain\Models;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Global contact channels for the website.
 *
 * @property int $id
 * @property ContactChannelType $channel_type
 * @property string|null $label
 * @property string $value
 * @property bool $is_active
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ContactChannel extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'contact_channels';

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'channel_type',
        'label',
        'value',
        'is_active',
        'sort_order',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'channel_type' => ContactChannelType::class,
        'is_active' => 'bool',
        'sort_order' => 'int',
    ];
}
