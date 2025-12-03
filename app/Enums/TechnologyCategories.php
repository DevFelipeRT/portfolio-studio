<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the main classification buckets for technologies.
 */
enum TechnologyCategories: string implements IEnum
{
    use CommonEnumMethods;

    case FRONTEND = 'frontend';
    case BACKEND = 'backend';
    case DEVOPS = 'devops';
    case DATABASE = 'database';
    case TESTING = 'testing';
    case TOOLING = 'tooling';

    /**
     * Returns a human-readable label for the category.
     */
    public function label(): string
    {
        return match ($this) {
            self::FRONTEND => 'Front-end',
            self::BACKEND => 'Back-end',
            self::DEVOPS => 'DevOps',
            self::DATABASE => 'Database',
            self::TESTING => 'Testing',
            self::TOOLING => 'Tooling',
        };
    }
}
