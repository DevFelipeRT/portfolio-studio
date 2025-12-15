<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Capabilities;

/**
 * Contract for the central capability catalog.
 */
interface ICapabilityCatalog
{
    /**
     * Registers a capability definition and its provider.
     */
    public function register(ICapabilityDefinition $definition, ICapabilityProvider $provider): void;

    /**
     * Checks whether a capability is registered for the given key.
     */
    public function has(ICapabilityKey $key): bool;

    /**
     * Returns the capability definition for the given key.
     */
    public function getDefinition(ICapabilityKey $key): ?ICapabilityDefinition;

    /**
     * Returns the capability provider for the given key.
     */
    public function getProvider(ICapabilityKey $key): ?ICapabilityProvider;

    /**
     * Returns all registered capability definitions.
     *
     * @return iterable<ICapabilityDefinition>
     */
    public function allDefinitions(): iterable;
}
