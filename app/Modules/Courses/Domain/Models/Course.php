<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Models;

use App\Modules\Courses\Domain\Enums\CourseCategories;
use App\Modules\Courses\Domain\Enums\CourseStatus;
use Carbon\CarbonImmutable;
use InvalidArgumentException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * Course model.
 *
 * @property int $id
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

    /**
     * Intercept assignments to allow runtime-only, typed 'status' values.
     *
     * Normalizes input to CourseStatus and stores the instance in computedAttributes.
     * Null assignments are rejected.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return $this
     *
     * @throws InvalidArgumentException
     */
    public function setAttribute($key, $value)
    {
        if ($key === 'status') {
            if ($value === null) {
                throw new InvalidArgumentException('Status cannot be null.');
            }

            if ($value instanceof CourseStatus) {
                $this->computedAttributes['status'] = $value;
                return $this;
            }

            if (is_string($value) || is_int($value)) {
                $enum = CourseStatus::tryFrom($value);
                if ($enum !== null) {
                    $this->computedAttributes['status'] = $enum;
                    return $this;
                }

                throw new InvalidArgumentException(sprintf(
                    'Invalid status value [%s] for Course model.',
                    (string) $value
                ));
            }

            throw new InvalidArgumentException('Unsupported type for status assignment.');
        }

        return parent::setAttribute($key, $value);
    }

    /**
     * Return runtime-assigned status if present, otherwise delegate to Eloquent resolution.
     *
     * The returned value is always CourseStatus when accessed via $course->status.
     *
     * @param  string  $key
     * @return mixed
     */
    public function getAttribute($key)
    {
        if ($key === 'status') {
            if (array_key_exists('status', $this->computedAttributes)) {
                return $this->computedAttributes['status'];
            }

            return parent::getAttribute($key);
        }

        return parent::getAttribute($key);
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
            get: function ($value): CourseStatus {
                $now = CarbonImmutable::now()->startOfDay();

                /** @var CarbonImmutable|null $startedAt */
                $startedAt = $this->started_at ?? null;

                /** @var CarbonImmutable|null $completedAt */
                $completedAt = $this->completed_at ?? null;

                $status = $this->resolveStatus($now, $startedAt, $completedAt);

                if ($status === null) {
                    // Defensive: resolveStatus should not return null for valid inputs.
                    throw new InvalidArgumentException('Could not resolve course status.');
                }

                return $status;
            }
        );
    }

    /**
     * Ensure toArray() returns the string representation for 'status'.
     *
     * Internally the model exposes CourseStatus; when serializing, emit ->value.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $array = parent::toArray();

        if (array_key_exists('status', $array)) {
            $status = $this->getAttribute('status');
            $array['status'] = $status instanceof CourseStatus ? $status->value : (string) $status;
        }

        return $array;
    }

    /**
     * Resolve domain-typed status from dates.
     *
     * Uses CarbonImmutable comparisons exclusively and returns CourseStatus.
     *
     * @param  CarbonImmutable       $now
     * @param  CarbonImmutable|null  $startedAt
     * @param  CarbonImmutable|null  $completedAt
     * @return CourseStatus|null
     */
    private function resolveStatus(
        CarbonImmutable $now,
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt
    ): ?CourseStatus {
        if ($startedAt !== null && $completedAt !== null) {
            $this->validatePeriod($startedAt, $completedAt);
        }

        if ($this->isPlanned($now, $startedAt, $completedAt)) {
            return CourseStatus::PLANNED;
        }

        if ($this->isCompleted($now, $startedAt, $completedAt)) {
            return CourseStatus::COMPLETED;
        }

        if ($this->isInProgress($now, $startedAt, $completedAt)) {
            return CourseStatus::IN_PROGRESS;
        }

        return null;
    }

    private function isPlanned(
        CarbonImmutable $now,
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt
    ): bool {
        if ($completedAt !== null && $completedAt->lessThanOrEqualTo($now)) {
            return false;
        }

        if ($startedAt !== null && $startedAt->lessThanOrEqualTo($now)) {
            return false;
        }

        return true;
    }

    private function isInProgress(
        CarbonImmutable $now,
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt
    ): bool {
        if ($completedAt !== null && $completedAt->lessThan($now)) {
            return false;
        }

        if ($startedAt !== null && $startedAt->greaterThan($now)) {
            return false;
        }

        return true;
    }

    private function isCompleted(
        CarbonImmutable $now,
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt
    ): bool {
        if ($completedAt === null || $completedAt->greaterThanOrEqualTo($now)) {
            return false;
        }

        if ($startedAt !== null && $startedAt->greaterThan($now)) {
            return false;
        }

        return true;
    }

    private function validatePeriod(
        CarbonImmutable $startedAt,
        CarbonImmutable $completedAt
    ): void {
        if ($startedAt->greaterThan($completedAt)) {
            throw new InvalidArgumentException('Invalid period of time.');
        }
    }
}
