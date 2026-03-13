<?php

namespace App\Modules\Inertia\Domain\Enums;

enum InertiaLocalizationScope: string
{
    case System = 'system';
    case Public = 'public';
}
