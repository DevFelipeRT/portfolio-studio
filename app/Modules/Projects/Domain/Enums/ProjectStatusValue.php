<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Enums;

enum ProjectStatusValue: string
{
    case DELIVERED = 'delivered';
    case IN_PROGRESS = 'in_progress';
    case MAINTENANCE = 'maintenance';
    case PLANNED = 'planned';
}
