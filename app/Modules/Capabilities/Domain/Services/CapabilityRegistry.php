<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Services;

use App\Modules\Capabilities\Domain\Models\RegisteredCapability;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;

/**
 * Manages registration and lookup of capabilities in the capabilities domain.
 */
final class CapabilityRegistry
{
    /**
     * @var array<string, RegisteredCapability>
     */
    private array $capabilities = [];

    /**
     * Registers a capability, replacing any existing entry for the same key.
     */
    public function register(RegisteredCapability $capability): void
    {
        $this->capabilities[$capability->getKey()->value()] = $capability;
    }

    /**
     * Checks whether a capability with the given key is registered.
     */
    public function has(ICapabilityKey $key): bool
    {
        return \array_key_exists($key->value(), $this->capabilities);
    }

    /**
     * Returns the registered capability for the given key or null when not found.
     */
    public function get(ICapabilityKey $key): ?RegisteredCapability
    {
        return $this->capabilities[$key->value()] ?? null;
    }

    /**
     * Returns all registered capabilities.
     *
     * @return iterable<RegisteredCapability>
     */
    public function all(): iterable
    {
        return $this->capabilities;
    }
}
