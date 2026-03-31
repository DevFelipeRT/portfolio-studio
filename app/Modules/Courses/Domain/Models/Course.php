<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Models;

use App\Modules\Courses\Domain\Enums\CourseCategories;
use App\Modules\Courses\Domain\ValueObjects\CourseStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Course model.
 *
 * @property int $id
 * @property string $locale
 * @property string $name
 * @property string|null $institution
 * @property CourseCategories $category
 * @property string|null $summary
 * @property string|null $description
 * @property \Carbon\CarbonImmutable|null $started_at
 * @property \Carbon\CarbonImmutable|null $completed_at
 * @property bool $display
 *
 * @property-read CourseStatus $status Domain-typed runtime attribute (non-null).
 */
class Course extends Model
{
    /**
     * Storage for runtime-only computed attributes.
     *
     * Values stored here are not part of the Eloquent $attributes array and will not be persisted.
     *
     * @var array<string, mixed>
     */
    protected array $computedAttributes = [];

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'locale',
        'name',
        'institution',
        'category',
        'summary',
        'description',
        'started_at',
        'completed_at',
        'display',
    ];

    /**
     * Attribute type casting.
     *
     * Use immutable_date to ensure date-only CarbonImmutable instances.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'category' => CourseCategories::class,
        'locale' => 'string',
        'started_at' => 'immutable_date:Y-m-d',
        'completed_at' => 'immutable_date:Y-m-d',
    ];

    /**
     * Attributes appended during array/JSON serialization.
     *
     * Keep 'status' so it behaves like other attributes in output.
     *
     * @var array<int,string>
     */
    protected $appends = [
        'status',
    ];

    public function setAttribute($key, $value)
    {
        if ($key === 'started_at' || $key === 'completed_at') {
            unset($this->computedAttributes['status']);
        }

        return parent::setAttribute($key, $value);
    }

    /**
     * Runtime computed status attribute getter.
     *
     * Returns CourseStatus for domain usage; throws if resolution fails.
     *
     * Implementation uses the casted date attributes directly (CarbonImmutable)
     * and avoids any DateTime conversions.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     *
     * @throws InvalidArgumentException
     */
    public function status(): Attribute
    {
        return new Attribute(
            get: fn(): CourseStatus => $this->resolveStatus(),
        );
    }

    /**
     * Localized course content.
     *
     * @return HasMany<CourseTranslation>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(CourseTranslation::class, 'course_id');
    }

    /**
     * Ensure toArray() returns the string representation for 'status'.
     *
     * Internally the model exposes CourseStatus; when serializing, emit its canonical scalar value.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $array = parent::toArray();

        if (array_key_exists('status', $array)) {
            $status = $this->getAttribute('status');
            $array['status'] = $status instanceof CourseStatus ? $status->toScalar() : (string) $status;
        }

        return $array;
    }

    private function resolveStatus(): CourseStatus
    {
        $cachedStatus = $this->computedAttributes['status'] ?? null;

        if ($cachedStatus instanceof CourseStatus) {
            return $cachedStatus;
        }

        /** @var CarbonImmutable|null $startedAt */
        $startedAt = $this->started_at instanceof CarbonImmutable
            ? $this->started_at
            : null;

        /** @var CarbonImmutable|null $completedAt */
        $completedAt = $this->completed_at instanceof CarbonImmutable
            ? $this->completed_at
            : null;

        $resolvedStatus = CourseStatus::fromDates($startedAt, $completedAt);
        $this->computedAttributes['status'] = $resolvedStatus;

        return $resolvedStatus;
    }
}
