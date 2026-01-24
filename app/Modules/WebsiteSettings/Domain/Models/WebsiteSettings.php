<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Domain\Models;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Global website settings.
 *
 * @property int $id
 * @property array<string,string>|null $site_name
 * @property array<string,string>|null $site_description
 * @property string|null $owner_name
 * @property string|null $default_locale
 * @property string|null $fallback_locale
 * @property string|null $canonical_base_url
 * @property string|null $meta_title_template
 * @property array<string,string>|null $default_meta_title
 * @property array<string,string>|null $default_meta_description
 * @property int|null $default_meta_image_id
 * @property int|null $default_og_image_id
 * @property int|null $default_twitter_image_id
 * @property array<string,mixed>|null $robots
 * @property array<string,mixed>|null $system_pages
 * @property array<int,mixed>|null $institutional_links
 * @property bool $public_scope_enabled
 * @property bool $private_scope_enabled
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read Image|null $defaultMetaImage
 * @property-read Image|null $defaultOgImage
 * @property-read Image|null $defaultTwitterImage
 */
class WebsiteSettings extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'website_settings';

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'site_name',
        'site_description',
        'owner_name',
        'default_locale',
        'fallback_locale',
        'canonical_base_url',
        'meta_title_template',
        'default_meta_title',
        'default_meta_description',
        'default_meta_image_id',
        'default_og_image_id',
        'default_twitter_image_id',
        'robots',
        'system_pages',
        'institutional_links',
        'public_scope_enabled',
        'private_scope_enabled',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'site_name' => 'array',
        'site_description' => 'array',
        'default_meta_title' => 'array',
        'default_meta_description' => 'array',
        'robots' => 'array',
        'system_pages' => 'array',
        'institutional_links' => 'array',
        'public_scope_enabled' => 'bool',
        'private_scope_enabled' => 'bool',
    ];

    /**
     * Default meta image relation.
     *
     * @return BelongsTo<Image,WebsiteSettings>
     */
    public function defaultMetaImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'default_meta_image_id');
    }

    /**
     * Default Open Graph image relation.
     *
     * @return BelongsTo<Image,WebsiteSettings>
     */
    public function defaultOgImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'default_og_image_id');
    }

    /**
     * Default Twitter image relation.
     *
     * @return BelongsTo<Image,WebsiteSettings>
     */
    public function defaultTwitterImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'default_twitter_image_id');
    }
}
