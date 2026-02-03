<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a localized course content set.
 *
 * @property int $id
 * @property int $course_id
 * @property string $locale
 * @property string|null $name
 * @property string|null $institution
 * @property string|null $summary
 * @property string|null $description
 */
class CourseTranslation extends Model
{
    use HasFactory;

    /**
     * @var array<int,string>
     */
    protected $fillable = [
        'course_id',
        'locale',
        'name',
        'institution',
        'summary',
        'description',
    ];

    /**
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'course_id' => 'integer',
    ];

    /**
     * Course that owns this translation.
     *
     * @return BelongsTo<Course,CourseTranslation>
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
