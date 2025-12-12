<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Models;

use App\Models\Image;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Content-managed page entity.
 *
 * Represents an editable page in the portfolio, including SEO metadata
 * and publication state. Each page is composed of multiple PageSection
 * instances that define its logical layout.
 *
 * @property int $id
 * @property string $slug
 * @property string $internal_name
 * @property string $title
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property int|null $meta_image_id
 * @property string|null $layout_key
 * @property string $locale
 * @property bool $is_published
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property bool $is_indexable
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read Collection<int,\App\Modules\ContentManagement\Domain\Models\PageSection> $sections
 * @property-read \App\Models\Image|null $metaImage
 */
class Page extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'slug',
        'internal_name',
        'title',
        'meta_title',
        'meta_description',
        'meta_image_id',
        'layout_key',
        'locale',
        'is_published',
        'published_at',
        'is_indexable',
    ];

    /**
     * Attribute casting configuration.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'is_published' => 'bool',
        'is_indexable' => 'bool',
        'published_at' => 'datetime',
    ];

    /**
     * Sections that compose this page.
     *
     * Sections are ordered by their position field by default.
     *
     * @return HasMany<PageSection>
     */
    public function sections(): HasMany
    {
        return $this
            ->hasMany(PageSection::class)
            ->orderBy('position');
    }

    /**
     * Meta image associated with this page.
     *
     * @return BelongsTo<Image,Page>
     */
    public function metaImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'meta_image_id');
    }
}
