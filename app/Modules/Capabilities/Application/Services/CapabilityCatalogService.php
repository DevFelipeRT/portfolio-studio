<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Application\Services;

use App\Modules\Capabilities\Domain\Models\RegisteredCapability;
use App\Modules\Capabilities\Domain\Services\CapabilityRegistry;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityCatalog;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;

/**
 * Application-level implementation of the capability catalog contract.
 */
final class CapabilityCatalogService implements ICapabilityCatalog
{
    public function __construct(
        private readonly CapabilityRegistry $registry,
    ) {
    }

    public function register(
        ICapabilityDefinition $definition,
        ICapabilityProvider $provider,
    ): void {
        $registered = $definition instanceof RegisteredCapability
            ? $definition
            : new RegisteredCapability(
                $definition->getKey(),
                $definition->getDescription(),
                $definition->getParametersSchema(),
                $definition->getReturnTypeDescription(),
                $definition->isPublic(),
                $provider,
            );

        $this->registry->register($registered);
    }

    public function has(ICapabilityKey $key): bool
    {
        return $this->registry->has($key);
    }

    public function getDefinition(ICapabilityKey $key): ?ICapabilityDefinition
    {
        return $this->registry->get($key);
    }

    public function getProvider(ICapabilityKey $key): ?ICapabilityProvider
    {
        $capability = $this->registry->get($key);

        return $capability?->getProvider();
    }

    /**
     * @return iterable<ICapabilityDefinition>
     */
    public function allDefinitions(): iterable
    {
        return $this->registry->all();
    }
}
