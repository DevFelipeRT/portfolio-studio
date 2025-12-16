<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\ValueObjects;

use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;

/**
 * Value object representing a stable, versioned capability key.
 */
final class CapabilityKey implements ICapabilityKey
{
    public function __construct(
        private readonly string $value,
    ) {
    }

    public function value(): string
    {
        return $this->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
