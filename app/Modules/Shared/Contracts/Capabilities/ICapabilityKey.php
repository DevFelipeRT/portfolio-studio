<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Capabilities;

/**
 * Represents a stable, versioned capability key.
 */
interface ICapabilityKey
{
    /**
     * Returns the canonical capability key value.
     */
    public function value(): string;
}
