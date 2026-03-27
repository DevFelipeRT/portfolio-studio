<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Models;

use App\Modules\Projects\Domain\Enums\ProjectStatusValue;
use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use InvalidArgumentException;

/**
 * Represents a localized project content set.
 *
 * @property int $id
 * @property int $project_id
 * @property string $locale
 * @property string|null $name
 * @property string|null $summary
 * @property string|null $description
 * @property ProjectStatus|null $status
 * @property string|null $repository_url
 * @property string|null $live_url
 */
class ProjectTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'project_id',
        'locale',
        'name',
        'summary',
        'description',
        'status',
        'repository_url',
        'live_url',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'project_id' => 'integer',
    ];

    public function status(): Attribute
    {
        return new Attribute(
            get: fn(mixed $value): ?ProjectStatus => $this->normalizeStatusFromStorage($value),
            set: fn(mixed $value): ?string => $this->normalizeStatusForStorage($value),
        );
    }

    /**
     * Project that owns this translation.
     *
     * @return BelongsTo<Project,ProjectTranslation>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        $array = parent::toArray();

        if (array_key_exists('status', $array)) {
            $status = $this->getAttribute('status');
            $array['status'] = $status instanceof ProjectStatus
                ? $status->toScalar()
                : $status;
        }

        return $array;
    }

    private function normalizeStatusFromStorage(mixed $value): ?ProjectStatus
    {
        if ($value instanceof ProjectStatus) {
            return $value;
        }

        if ($value instanceof ProjectStatusValue) {
            return ProjectStatus::fromValue($value);
        }

        if (is_string($value)) {
            return ProjectStatus::fromScalar($value);
        }

        if ($value === null) {
            return null;
        }

        throw new InvalidArgumentException('Unsupported project status.');
    }

    private function normalizeStatusForStorage(mixed $value): ?string
    {
        if ($value instanceof ProjectStatus) {
            return $value->toScalar();
        }

        if ($value instanceof ProjectStatusValue) {
            return $value->value;
        }

        if (is_string($value)) {
            return ProjectStatus::fromScalar($value)->toScalar();
        }

        if ($value === null) {
            return null;
        }

        throw new InvalidArgumentException('Unsupported project status.');
    }
}
