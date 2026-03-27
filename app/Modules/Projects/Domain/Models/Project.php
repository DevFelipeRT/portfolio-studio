<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Models;

use App\Modules\Projects\Domain\Enums\ProjectStatusValue;
use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use InvalidArgumentException;

/**
 * Eloquent model representing a portfolio project.
 *
 * @property ProjectStatus|null $status
 */
class Project extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'locale',
        'name',
        'summary',
        'description',
        'status',
        'repository_url',
        'live_url',
        'display',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'display' => 'boolean',
    ];

    public function status(): Attribute
    {
        return new Attribute(
            get: fn(mixed $value): ?ProjectStatus => $this->normalizeStatusFromStorage($value),
            set: fn(mixed $value): ?string => $this->normalizeStatusForStorage($value),
        );
    }

    /**
     * Images associated with the project.
     *
     * Pivot table: image_attachments
     * Pivot fields: position, is_cover, caption
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
                'position',
                'is_cover',
                'caption',
            ])
            ->withTimestamps();
    }

    /**
     * Skills associated with the project.
     *
     * Pivot table: project_skill
     *
     * @return BelongsToMany<Skill>
     */
    public function skills(): BelongsToMany
    {
        return $this
            ->belongsToMany(
                Skill::class,
                'project_skill',
                'project_id',
                'skill_id',
            )
            ->withTimestamps();
    }

    /**
     * Localized project content.
     *
     * @return HasMany<ProjectTranslation>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ProjectTranslation::class, 'project_id');
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
