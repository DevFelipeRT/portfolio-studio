<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Module-level content settings.
 *
 * Stores global configuration values for the ContentManagement module,
 * including the slug used to resolve the home page.
 *
 * @property int $id
 * @property string $home_slug
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ContentSettings extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'content_settings';

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'home_slug',
    ];
}
