<?php

namespace App\Enums;

/**
 * CourseStatus represents the lifecycle state of a course record.
 */
enum CourseStatus: string implements IEnum
{
    use CommonEnumMethods;

    case PLANNED = 'planned';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';

    /**
     * Returns a human readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::PLANNED => 'Planned',
            self::IN_PROGRESS => 'In progress',
            self::COMPLETED => 'Completed',
        };
    }
}
