<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\Enums;

/**
 * Canonical persisted-agnostic values for the derived course status concept.
 */
enum CourseStatusValue: string
{
    case PLANNED = 'planned';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
}
