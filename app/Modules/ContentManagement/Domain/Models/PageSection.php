<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Models;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Carbon;
use Carbon\CarbonInterface;

/**
 * Content block belonging to a managed page.
 *
 * Represents a single section within a page, linked to a template key
 * and storing its specific configuration and content payload in the
 * data attribute. Visibility is controlled by activation flags and
 * optional time windows.
 *
 * @property int $id
 * @property int $page_id
 * @property string $template_key
 * @property string|null $slot
 * @property int $position
 * @property string|null $anchor
 * @property string|null $navigation_label
 * @property array|null $data
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $visible_from
 * @property \Illuminate\Support\Carbon|null $visible_until
 * @property string|null $locale
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read \App\Modules\ContentManagement\Domain\Models\Page $page
 */
class PageSection extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'page_id',
        'template_key',
        'slot',
        'position',
        'anchor',
        'navigation_label',
        'data',
        'is_active',
        'visible_from',
        'visible_until',
        'locale',
    ];

    /**
     * Attribute casting configuration.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'data' => 'array',
        'is_active' => 'bool',
        'visible_from' => 'datetime',
        'visible_until' => 'datetime',
    ];

    /**
     * Page that owns this section.
     *
     * @return BelongsTo<Page,PageSection>
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    /**
     * Scope for sections that are marked as active.
     *
     * @param  Builder<PageSection>  $query
     * @return Builder<PageSection>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for sections visible at a given reference time.
     *
     * The visibility window is defined by visible_from and visible_until.
     *
     * @param  Builder<PageSection>        $query
     * @param  CarbonInterface|string|null $referenceTime
     * @return Builder<PageSection>
     */
    public function scopeVisibleAt(Builder $query, CarbonInterface|string|null $referenceTime = null): Builder
    {
        $reference = $referenceTime instanceof CarbonInterface
            ? $referenceTime
            : Carbon::parse($referenceTime ?? now());

        return $query
            ->where(function (Builder $innerQuery) use ($reference): void {
                $innerQuery
                    ->whereNull('visible_from')
                    ->orWhere('visible_from', '<=', $reference);
            })
            ->where(function (Builder $innerQuery) use ($reference): void {
                $innerQuery
                    ->whereNull('visible_until')
                    ->orWhere('visible_until', '>=', $reference);
            });
    }

    /**
     * Images associated with this page section.
     *
     * Pivot table: image_attachments
     * Pivot fields: slot, position, is_cover, caption
     *
     * @return MorphToMany<Image>
     */
    public function images(): MorphToMany
    {
        return $this
            ->morphToMany(
                Image::class,
                'owner',
                'image_attachments',
                'owner_id',
                'image_id',
            )
            ->withPivot([
                'slot',
                'position',
                'is_cover',
                'caption',
            ])
            ->withTimestamps();
    }
}
