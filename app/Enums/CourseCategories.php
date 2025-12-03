<?php

namespace App\Enums;

/**
 * CourseCategories defines the main categories for educational records.
 */
enum CourseCategories: string implements IEnum
{
    use CommonEnumMethods;

    case ACADEMIC_DEGREE = 'academic_degree';
    case TECHNICAL_COURSE = 'technical_course';
    case CERTIFICATION = 'certification';
    case WORKSHOP = 'workshop';
    case OTHER = 'other';

    /**
     * Returns a human readable label for the category.
     */
    public function label(): string
    {
        return match ($this) {
            self::ACADEMIC_DEGREE => 'Academic degree',
            self::TECHNICAL_COURSE => 'Technical course',
            self::CERTIFICATION => 'Certification',
            self::WORKSHOP => 'Workshop',
            self::OTHER => 'Other',
        };
    }
}
