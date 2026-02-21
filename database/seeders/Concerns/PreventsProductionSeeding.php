<?php

declare(strict_types=1);

namespace Database\Seeders\Concerns;

trait PreventsProductionSeeding
{
    private function assertNotProduction(): void
    {
        if (app()->environment('production')) {
            throw new \RuntimeException('Seeding is disabled in production environment.');
        }
    }
}

